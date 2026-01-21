// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import type { GridPaint as gp } from '../index.js';

/**
 * Resize the actual canvas and cell widths and heighs so they can fit to the parent window
 *
 * @see GridPaint#fitToWindow
 */
function resize(this: gp, w = 0, h = 0): void {
    this.canvas.width =  this.width  * (w || this.cellWidth);
    this.canvas.height = this.height * (h || this.cellHeight);
    // Zero defaults to this values
    this.cellWidth =  (w || this.cellWidth);
    this.cellHeight = (h || this.cellHeight);
}

/**
 * Resize the drawing such that it has more cells to color.
 * The function will try and resize the painting such that it is centered.
 * NOTE: after calling this, you may need to call GridPaint#fitToWindow()
 *
 * @see GridPaint#fitToWindow
 */
function resizePainting(this: gp, w = 0, h = 0, default_colour = 0): void {
    const new_width = w || this.width;
    const new_height = h || this.height;
    const old_width = this.width;
    const old_height = this.height;
    const delta_w = new_width - old_width;
    const delta_h = new_height - old_height;

    if (delta_w === 0 && delta_h === 0) {
        return;
    }

    this.width = new_width;
    this.height = new_height;
    this.canvas.width =  this.width  * this.cellWidth;
    this.canvas.height = this.height * this.cellHeight;

    this.oldPainting = this.painting.splice(0, this.painting.length);

    if (delta_h > -1) {
        const center_top = delta_h / 2 | 0;
        const center_bot = delta_h / 2 + (delta_h & 1) | 0;

        for (let i = 0; i < center_top; ++i) {
            this.painting.push(Array.from({ length: old_width }, () => default_colour));
        }

        this.painting = this.painting.concat(this.oldPainting.map(arr => Array.from(arr, el => el)));

        for (let i = 0; i < center_bot; ++i) {
            this.painting.push(Array.from({ length: old_width }, () => default_colour));
        }
    }
    else {
        const center_top_crop = -(delta_h / 2) | 0;
        const center_bot_crop = -(delta_h / 2) + (delta_h & 1) | 0;

        this.painting = this.painting.concat(this.oldPainting.map(arr => Array.from(arr, el => el)));
        this.painting.splice(0, center_top_crop);
        this.painting.splice(-center_bot_crop, center_bot_crop);
    }

    if (delta_w > -1) {
        const center_left = delta_w / 2 | 0;
        const center_right = delta_w / 2 + (delta_w & 1) | 0;
        this.painting = this.painting.map(arr => {
            const tmp = Array
                .from({ length: center_left }, () => default_colour)
                .concat(arr)
                .concat(Array.from({ length: center_right }, () => default_colour));
            return tmp;
        });
    }
    else {
        const center_left = -(delta_w / 2) | 0;
        const center_right = -(delta_w / 2) + (delta_w & 1) | 0;
        this.painting.forEach(arr => {
            arr.splice(0, center_left);
            arr.splice(-center_right, center_right);
        });
    }

    // if (this.painting.length != this.height) {
    //     throw `Invalid height, expected ${new_height}, got ${this.painting.length}`;
    // }

    // for (let i = 0; i < this.painting.length; ++i) {
    //     if (this.painting[i].length != this.width) {
    //         throw `Invalid width at ${i}: expected ${new_width}, got ${this.painting[i].length}`;
    //     }
    // }

    this.compareChanges();
    this.draw();
}

function fitToWindow(this: gp): void {
    if (!this.canvas.parentElement) return;
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
    else if (
        canWidth    < expectedWidth &&
        parentWidth < expectedWidth
    ) {
        const newW = parentWidth;
        const newcw = newW / this.width;
        const newch = newcw / aspectRatio;
        this.resize(newcw, newch);
    }
    else if (expectedWidth > canWidth &&
        expectedWidth < parentWidth) {
        this.resize(this.origCellW, this.origCellH);
    }
    if (!this.drawing) this.draw();
}

export { resize, resizePainting, fitToWindow };
