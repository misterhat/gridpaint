/*
 * gridpaint - a canvas for creating grid-based art in the browser
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

    inherits = require('inherits'),

    Canvas = require('./lib/canvas'),
    draw = require('./lib/draw'),
    handlers = require('./lib/handlers'),
    save = require('./lib/save'),
    tools = require('./lib/tools');

var DEFAULT_PALETTE = [ 'transparent', '#fff', '#c0c0c0', '#808080', '#000',
                        '#f00', '#800', '#ff0', '#808000', '#0f0', '#080',
                        '#0ff', '#008080', '#00f', '#000080', '#f0f',
                        '#800080' ];

function GridPaint(options) {
    // use as a constructor without `new`
    if (!(this instanceof GridPaint)) {
        return new GridPaint(options);
    }

    options = options || {};
    EventEmitter.call(this);

    this.width = options.width || 16;
    this.height = options.height || this.width;
    this.cellWidth = options.cellWidth || 16;
    this.cellHeight = options.cellHeight || this.cellWidth;
    this.palette = options.palette || DEFAULT_PALETTE;

    this.canvas = new Canvas(this.width * this.cellWidth,
                             this.height * this.cellHeight);
    this.ctx = this.canvas.getContext('2d');

    this.background = true;
    this.colour = 0;
    this.cursor = { x: -1, y: -1 };
    this.grid = false;
    this.gridColour = '#000';
    this.isApplied = false;
    this.painting = [];
    this.redoHistory = [];
    this.tool = 'pencil';
    this.undoHistory = [];

    if (process.browser) {
        this.canvas.className = 'gridpaint-canvas';
        this.canvas.style.cursor = 'crosshair';

        if (/firefox/i.test(navigator.userAgent)) {
            this.canvas.style.imageRendering = '-moz-crisp-edges';
        } else {
            this.canvas.style.imageRendering = 'pixelated';
        }

        this.dom = this.canvas;

        // cache because creating functions is expensive
        this.boundDraw = this.draw.bind(this);
    }

    this.clear();
}

inherits(GridPaint, EventEmitter);

GridPaint.prototype.resize = function () {
    this.canvas.width = this.width * this.cellWidth;
    this.canvas.height = this.height * this.cellHeight;
};

// perform the current tool's action on the painting
GridPaint.prototype.action = function () {
    this[this.tool]();
    this.emit('action');
};

GridPaint.prototype.applyTool = tools.apply;
GridPaint.prototype.bucket = tools.bucket;
GridPaint.prototype.clear = tools.clear;
GridPaint.prototype.compareChanges = tools.compare;
GridPaint.prototype.contrastGrid = tools.contrast;
GridPaint.prototype.pencil = tools.pencil;
GridPaint.prototype.redo = tools.redo;
GridPaint.prototype.replace = tools.replace;
GridPaint.prototype.undo = tools.undo;

GridPaint.prototype.drawBackground = draw.background;
GridPaint.prototype.drawCursor = draw.cursor;
GridPaint.prototype.drawGrid = draw.grid;
GridPaint.prototype.drawPainting = draw.painting;
GridPaint.prototype.draw = draw.tick;

GridPaint.prototype.saveAs = save;

GridPaint.prototype.attachHandlers = handlers.attach;
GridPaint.prototype.detachHandlers = handlers.detach;

// attach handlers & start draw loop
GridPaint.prototype.init = function () {
    this.attachHandlers();
    this.drawing = true;
    this.draw();
};

// detach handlers & start draw loop
GridPaint.prototype.destroy = function () {
    this.detachHandlers();
    this.drawing = false;
};

module.exports = GridPaint;
