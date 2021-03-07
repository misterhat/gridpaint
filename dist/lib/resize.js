"use strict";
// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
Object.defineProperty(exports, "__esModule", { value: true });
exports.fitToWindow = exports.resize = void 0;
const browser_1 = require("./browser");
function resize(w = 0, h = 0) {
    this.canvas.width = this.width * (w || this.cellWidth);
    this.canvas.height = this.height * (h || this.cellHeight);
    // Zero defaults to this values
    this.cellWidth = (w || this.cellWidth);
    this.cellHeight = (h || this.cellHeight);
}
exports.resize = resize;
function fitToWindow() {
    if (!browser_1.isBrowser)
        return;
    if (!this.canvas.parentElement)
        return;
    const expectedWidth = this.origCellW * this.width;
    const aspectRatio = this.cellWidth / this.cellHeight;
    const parentWidth = this.canvas.parentElement.clientWidth;
    const canWidth = this.canvas.width;
    if (canWidth > parentWidth) {
        const newW = parentWidth;
        const newcw = newW / this.width;
        const newch = newcw / aspectRatio;
        this.resize(newcw, newch);
    }
    else if (canWidth < expectedWidth &&
        parentWidth < expectedWidth) {
        const newW = parentWidth;
        const newcw = newW / this.width;
        const newch = newcw / aspectRatio;
        this.resize(newcw, newch);
    }
    else if (expectedWidth > canWidth &&
        expectedWidth < parentWidth) {
        this.resize(this.origCellW, this.origCellH);
    }
    if (!this.drawing)
        this.draw();
}
exports.fitToWindow = fitToWindow;
