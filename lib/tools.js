'use strict';

const deepDiff = require('deep-diff');

const bucket = require('./bucket');
const clear = require('./clear');
const replace = require('./replace');
const line_approx = require('./line.js').line_approx;
const line = require('./line.js').line;

const MAX_HISTORY = 99;

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function pushHistory(top, bottom, doChange) {
    let that;
    let changes;

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
}

// activated when the user's finger or mouse is pressed
exports.apply = function (isApplied) {
    if (typeof isApplied !== 'undefined') {
        this.isApplied = isApplied;
    }
    else {
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
    let changes = deepDiff.diff(this.oldPainting, this.painting);

    if (!changes) {
        return;
    }

    changes = changes.filter(function (change) {
        return change.kind === 'E';
    });

    if (changes.length) {
        this.undoHistory.push(changes);
        this.undoHistory.splice(0, this.undoHistory.length - MAX_HISTORY);
        this.redoHistory.length = 0;
    }
};

// fill in grid units one by one
exports.pencil = function () {
    let x = this.cursor.x;
    let y = this.cursor.y;

    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.painting[y][x] = this.colour;
    }
};

exports.line_approx = line_approx;
exports.line = line;

// redo the last painting action performed (if any)
exports.redo = function () {
    pushHistory.bind(
        this,
        this.redoHistory,
        this.undoHistory,
        deepDiff.applyChange,
    )();
    this.emit('redo');
};

exports.replace = replace;

// undo the last painting action performed (if any)
exports.undo = function () {
    pushHistory.bind(
        this,
        this.undoHistory,
        this.redoHistory,
        deepDiff.revertChange,
    )();
    this.emit('undo');
};
