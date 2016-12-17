var FileSaver = require('file-saver'),
    deepDiff = require('deep-diff'),

    bucket = require('./bucket'),
    clear = require('./clear'),
    contrast = require('./contrast'),
    replace = require('./replace');

var MAX_HISTORY = 99;

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

    setTimeout(this.contrastGrid.bind(this), 100);
}

// activated when the user's finger or mouse is pressed
exports.apply = function (isApplied) {
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

exports.bucket = bucket;
exports.clear = clear;

// compared oldPainting to painting & push the changes to history
exports.compare = function () {
    var changes = deepDiff.diff(this.oldPainting, this.painting);

    if (!changes) {
        return;
    }

    this.contrastGrid();

    changes = changes.filter(function (change) {
        return change.kind === 'E';
    });

    if (changes.length) {
        this.undoHistory.push(changes);
        this.undoHistory.splice(0, this.undoHistory.length - MAX_HISTORY);
        this.redoHistory.length = 0;
    }
};

exports.contrast = contrast;

// fill in grid units one by one
exports.pencil = function () {
    var x = this.cursor.x,
        y = this.cursor.y;

    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.painting[y][x] = this.colour;
    }
};

// redo the last painting action performed (if any)
exports.redo = function () {
    pushHistory.bind(this, this.redoHistory, this.undoHistory,
                     deepDiff.applyChange)();
    this.emit('redo');
};

exports.replace = replace;

// undo the last painting action performed (if any)
exports.undo = function () {
    pushHistory.bind(this, this.undoHistory, this.redoHistory,
                     deepDiff.revertChange)();
    this.emit('undo');
};
