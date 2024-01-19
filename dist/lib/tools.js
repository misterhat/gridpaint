"use strict";
// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
Object.defineProperty(exports, "__esModule", { value: true });
exports.line_approx = exports.compare = exports.replace = exports.apply = exports.clear = exports.undo = exports.redo = exports.line = exports.bucket = exports.pencil = void 0;
const bucket_1 = require("./bucket");
Object.defineProperty(exports, "bucket", { enumerable: true, get: function () { return bucket_1.bucket; } });
const clear_1 = require("./clear");
Object.defineProperty(exports, "clear", { enumerable: true, get: function () { return clear_1.clear; } });
const replace_1 = require("./replace");
Object.defineProperty(exports, "replace", { enumerable: true, get: function () { return replace_1.replace; } });
const line_1 = require("./line");
Object.defineProperty(exports, "line", { enumerable: true, get: function () { return line_1.line; } });
Object.defineProperty(exports, "line_approx", { enumerable: true, get: function () { return line_1.line_approx; } });
const MAX_HISTORY = 64;
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function pushHistory(top, bottom) {
    if (top.length === 0) {
        return;
    }
    const top_canvas = top.pop();
    if (top_canvas == null) {
        return;
    }
    bottom.push(this.painting.splice(0, this.painting.length));
    this.painting = top_canvas;
}
// activated when the user's finger or mouse is pressed
function apply(isApplied) {
    if (isApplied !== undefined) {
        this.isApplied = isApplied;
    }
    else {
        this.isApplied = !this.isApplied;
    }
    // activate the tool for initial mouse press
    if (this.isApplied) {
        this.action();
    }
}
exports.apply = apply;
/** compared oldPainting to painting & push the changes to history
 * @param state any object that returns on undo/redo.
 */
function compare() {
    if (this.oldPainting.length === this.painting.length) {
        if (this.painting.every((el, i) => el.toString() === this.oldPainting[i].toString())) {
            return;
        }
    }
    this.undoHistory.push(clone(this.oldPainting));
    this.undoHistory.splice(0, this.undoHistory.length - MAX_HISTORY);
    this.redoHistory.length = 0;
}
exports.compare = compare;
// fill in grid units one by one
function pencil() {
    const x = this.cursor.x;
    const y = this.cursor.y;
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.painting[y][x] = this.colour;
    }
}
exports.pencil = pencil;
// redo the last painting action performed (if any)
function redo() {
    pushHistory.apply(this, [
        this.redoHistory,
        this.undoHistory,
    ]);
}
exports.redo = redo;
// undo the last painting action performed (if any)
function undo() {
    pushHistory.apply(this, [
        this.undoHistory,
        this.redoHistory,
    ]);
}
exports.undo = undo;
