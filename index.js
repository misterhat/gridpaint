/*
 * gridpaint - a painting module for grid-based art
 * Copyright (C) 2016 Mister Hat
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

var EventEmitter = require('events'),
    util = require('util'),

    FileSaver = require('file-saver'),
    deepDiff = require('deep-diff');

var DEFAULT_PALETTE = [ 'transparent', '#fff', '#c0c0c0', '#808080', '#000',
                        '#f00', '#800', '#ff0', '#808000', '#0f0', '#080',
                        '#0ff', '#008080', '#00f', '#000080', '#f0f',
                        '#800080' ];
    MAX_HISTORY = 100;

var events = {
    mousemove: function (e) {
        var cw = this.cellWidth,
            ch = this.cellHeight,
            x = e.pageX - e.currentTarget.offsetLeft,
            y = e.pageY - e.currentTarget.offsetTop;

        this.cursor.x = Math.floor(x / this.width * (this.width / cw));
        this.cursor.y = Math.floor(y / this.height * (this.height / ch));

        if (this.isApplied) {
            this.action();
        }

        this.emit('move');
    },
    mousedown: function () {
        // create a clone to compare changes for undo history
        this.oldPainting = clone(this.painting);
        this.applyTool(true);
    },
    mouseup: function () {
        if (this.isApplied) {
            this.applyTool(false);
            this.compareChanges();
        }
    }
};

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function pushHistory(top, bottom, doChange) {
    var that, changes;

    if (!top.length) {
        return;
    }

    that = this;
    changes = top.pop();

    bottom.push(clone(changes));

    if (!changes) {
        return;
    }

    changes.forEach(function (change) {
        doChange(that.painting, that.painting, change);
    });

    setTimeout(this.newGridColour.bind(this), 100);
}

function GridPaint(options) {
    var that;

    // use as a constructor without `new`
    if (!(this instanceof GridPaint)) {
        return new GridPaint(options);
    }

    that = this;

    options = options || {};
    EventEmitter.call(this);

    this.width = options.width || 16;
    this.height = options.height || options.width;
    this.cellWidth = options.cellWidth || 16;
    this.cellHeight = options.cellHeight || this.cellWidth;
    this.palette = options.palette || DEFAULT_PALETTE;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.className = 'gridpaint-canvas';
    this.canvas.style.cursor = 'crosshair';

    if (/firefox/i.test(navigator.userAgent)) {
        this.canvas.style.imageRendering = '-moz-crisp-edges';
    } else {
        this.canvas.style.imageRendering = 'pixelated';
    }

    this.dom = this.canvas;

    this.events = {};

    Object.keys(events).forEach(function (h) {
        that.events[h] = events[h].bind(that);
        that.canvas.addEventListener(h, that.events[h], false);
    });

    // in case the user drags away from the canvas element
    window.addEventListener('mouseup', that.events.mouseup, false);

    // a 2D array of the colour palette indexes
    this.painting = [];
    // where the cross-hair is located on the grid (not in absolute pixels)
    this.cursor = { x: -1, y: -1 };
    // the selected colour index on the palette
    this.colour = 0;
    // is the user's mouse down or finger depressed?
    this.isApplied = false;
    // tool can be 'pencil', 'bucket', or 'move'
    this.tool = 'pencil';
    // the grid colour should contrast with the dominate colour of the painting
    this.gridColour = '#000';
    // overlap the painting with pink grid lines
    this.grid = false;
    // save a history of differences for undo/redo
    this.undoHistory = [];
    this.redoHistory = [];

    // cache because creating functions is expensive
    this.boundDraw = this.draw.bind(this);
}

util.inherits(GridPaint, EventEmitter);

GridPaint.prototype.resize = function () {
    this.canvas.width = this.width * this.cellWidth;
    this.canvas.height = this.height * this.cellHeight;
};

// empty all of the grid units
GridPaint.prototype.clear = function () {
    var i, j;

    // allow the user to undo a clear
    if (Array.isArray(this.painting) && Array.isArray(this.painting[0])) {
        this.oldPainting = clone(this.painting);
    }

    this.painting.length = 0;

    for (i = 0; i < this.height; i += 1) {
        this.painting.push([]);
        for (j = 0; j < this.width; j += 1) {
            this.painting[i].push(0);
        }
    }

    this.compareChanges();
    this.emit('clear');
};

// activated when the user's finger or mouse is pressed
GridPaint.prototype.applyTool = function (isApplied) {
    if (typeof isApplied !== 'undefined') {
        this.isApplied = isApplied;
    } else {
        this.isApplied = !this.isApplied;
    }

    // activate the tool for initial mouse press
    if (this.isApplied) {
        this.action();
    }

    this.emit('applyTool', this.isApplied);
};

// fill in grid units one by one
GridPaint.prototype.pencil = function () {
    var x = this.cursor.x,
        y = this.cursor.y;

    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.painting[y][x] = this.colour;
    }
};

// fill in surrounding, like-coloured grid units
GridPaint.prototype.bucket = function (replace, x, y) {
    var colour = this.colour;

    x = typeof x !== 'undefined' ? x : this.cursor.x;
    y = typeof y !== 'undefined' ? y : this.cursor.y;
    replace = typeof replace !== 'undefined' ? replace : this.painting[y][x];

    if (replace === colour || this.painting[y][x] !== replace) {
        return;
    }

    this.painting[y][x] = colour;

    if ((y + 1) < this.height) {
        this.bucket(replace, x, y + 1);
    }

    if ((y - 1) > -1) {
        this.bucket(replace, x, y - 1);
    }

    if ((x + 1) < this.width) {
        this.bucket(replace, x + 1, y);
    }

    if ((x - 1) > -1) {
        this.bucket(replace, x - 1, y);
    }
};

// set a contrasting grid colour
GridPaint.prototype.newGridColour = function () {
    var cw, ch, data, darkCells, i, j, offset, r, g, b, y;

    if (!this.grid) {
        return;
    }

    cw = this.cellWidth;
    ch = this.cellHeight;
    data = this.ctx.getImageData(0, 0, this.canvas.width,
                                 this.canvas.height).data;
    darkCells = 0;

    for (i = 0; i < this.width * cw; i += cw - 1) {
        for (j = 0; j < this.height * ch; j += ch - 1) {
            offset = (j * this.canvas.width + i) * 4;
            r = data[offset];
            g = data[offset + 1];
            b = data[offset + 2];
            y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            darkCells += y < 128;
        }
    }

    if (darkCells > (this.width * this.height) / 2) {
        this.gridColour = '#fff';
    } else {
        this.gridColour = '#000';
    }
};

// compared oldPainting to painting and push the changes to history
GridPaint.prototype.compareChanges = function () {
    var changes = deepDiff.diff(this.oldPainting, this.painting);

    if (!changes) {
        return;
    }

    this.newGridColour();

    changes = changes.filter(function (change) {
        return change.kind === 'E';
    });

    if (changes.length) {
        this.undoHistory.push(changes);
        this.undoHistory.splice(0, this.undoHistory.length - MAX_HISTORY);
        this.redoHistory.length = 0;
    }
};

// undo the last painting action performed (if any)
GridPaint.prototype.undo = function () {
    pushHistory.bind(this, this.undoHistory, this.redoHistory,
                     deepDiff.revertChange)();
    this.emit('undo');
};

// redo the last painting action performed (if any)
GridPaint.prototype.redo = function () {
    pushHistory.bind(this, this.redoHistory, this.undoHistory,
                     deepDiff.applyChange)();
    this.emit('redo');
};

// perform the current tool's action on the painting
GridPaint.prototype.action = function () {
    this[this.tool]();
    this.emit('action');
};

// export the painting to file
GridPaint.prototype.saveAs = function (file, scale) {
    var exported = document.createElement('canvas'),
        eCtx = exported.getContext('2d');

    file = file || 'painting.png';
    scale = scale || 1;

    exported.width = this.width * this.cellWidth * scale;
    exported.height = this.height * this.cellHeight * scale;
    this.drawPainting(eCtx, scale);

    exported.toBlob(function (blob) {
        FileSaver.saveAs(blob, file);
    });
};

// draw the checkered pattern to indicate transparency
GridPaint.prototype.drawBackground = function () {
    var odd = false,
        cw = this.cellWidth,
        ch = this.cellHeight,
        i, j;

    for (i = 0; i < this.width * 2; i += 1) {
        for (j = 0; j < this.height * 2; j += 1) {
            this.ctx.fillStyle = odd ? '#999' : '#666';
            this.ctx.fillRect(i * (cw / 2), j * (ch / 2), cw / 2, ch / 2);
            odd = !odd;
        }
        odd = !odd;
    }
};

// draw the grid units onto a canvas
GridPaint.prototype.drawPainting = function (ctx, scale) {
    var cw = this.cellWidth,
        ch = this.cellHeight,
        i, j;

    // this is just so we can re-use this function on the export
    ctx = ctx || this.ctx;
    scale = scale || 1;

    for (i = 0; i < this.height; i += 1) {
        for (j = 0; j < this.width; j += 1) {
            ctx.fillStyle = this.palette[this.painting[i][j]] || 'transparent';
            ctx.fillRect(j * cw * scale, i * ch * scale, cw * scale,
                         ch * scale);
        }
    }
};

// overlap the current colour as a crosshair over the position it will be
// applied to
GridPaint.prototype.drawCursor = function () {
    var cw, ch, x, y;

    if (this.cursor.x < 0 || this.cursor.y < 0) {
        return;
    }

    cw = this.cellWidth;
    ch = this.cellHeight;
    x = this.cursor.x;
    y = this.cursor.y;

    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = this.palette[this.colour];
    this.ctx.fillRect(x * cw + cw / 4, y * ch, cw / 2, ch);
    this.ctx.fillRect(x * cw, y * ch + ch / 4, cw, ch / 2);
    this.ctx.globalAlpha = 1;
};

// draw a properly contrasted grid over the image. if it contains more black
// than white, the grid colour will be white and vice versa
GridPaint.prototype.drawGrid = function () {
    var cw = this.cellWidth,
        ch = this.cellHeight,
        i;

    this.ctx.strokeStyle = this.gridColour;

    for (i = 0; i < this.width; i += 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * cw + 0.5, 0);
        this.ctx.lineTo(i * cw + 0.5, ch * this.height);
        this.ctx.stroke();
    }

    for (i = 0; i < this.height; i += 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, i * ch + 0.5);
        this.ctx.lineTo(cw * this.width, i * ch + 0.5);
        this.ctx.stroke();
    }
};

// start the drawing loop
GridPaint.prototype.draw = function () {
    this.drawBackground();
    this.drawPainting();
    this.drawCursor();

    if (this.grid) {
        this.drawGrid();
    }

    window.requestAnimationFrame(this.boundDraw);
};

GridPaint.prototype.init = function () {
    this.resize();
    this.clear();
    this.draw();
};

module.exports = GridPaint;
