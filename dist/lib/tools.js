"use strict";
// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.line_approx = exports.compare = exports.replace = exports.apply = exports.clear = exports.undo = exports.redo = exports.line = exports.bucket = exports.pencil = void 0;
const deepDiff = __importStar(require("deep-diff"));
const bucket_1 = require("./bucket");
Object.defineProperty(exports, "bucket", { enumerable: true, get: function () { return bucket_1.bucket; } });
const clear_1 = require("./clear");
Object.defineProperty(exports, "clear", { enumerable: true, get: function () { return clear_1.clear; } });
const replace_1 = require("./replace");
Object.defineProperty(exports, "replace", { enumerable: true, get: function () { return replace_1.replace; } });
const line_1 = require("./line");
Object.defineProperty(exports, "line", { enumerable: true, get: function () { return line_1.line; } });
Object.defineProperty(exports, "line_approx", { enumerable: true, get: function () { return line_1.line_approx; } });
const MAX_HISTORY = 99;
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function pushHistory(top, bottom, doChange) {
    if (!top.length) {
        return;
    }
    const changes = top.pop();
    bottom.push(clone(changes));
    if (!changes) {
        return;
    }
    changes.forEach((change) => {
        doChange(this.painting, this.painting, change);
    });
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
// compared oldPainting to painting & push the changes to history
function compare() {
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
        deepDiff.applyChange,
    ]);
}
exports.redo = redo;
// undo the last painting action performed (if any)
function undo() {
    pushHistory.apply(this, [
        this.undoHistory,
        this.redoHistory,
        deepDiff.revertChange,
    ]);
}
exports.undo = undo;
