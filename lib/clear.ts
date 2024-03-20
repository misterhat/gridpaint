// Copyright (C) 2017  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import type { GridPaint as gp } from '../index.js';

// Empty all of the grid units.
// Technically also initializes painting and oldPainting
function clear(this: gp, init = false, default_colour = 0): void {
    // Have to preserve array, empties it in-place.
    // Also backs up the array, by setting it to oldPainting
    // this is for undo history
    this.oldPainting = this.painting.splice(0, this.painting.length);
    for (let i = 0; i < this.height; ++i) {
        this.painting.push([]);
        for (let j = 0; j < this.width; ++j) {
            this.painting[i].push(default_colour);
        }
    }
    if (init) this.oldPainting = this.painting;
    this.line(/* cancel any line action */ true);
    this.compareChanges();
}

// clear with a given color or the current color on the gridpainter.
function clearWith(this: gp, colour = -1): void {
    if (colour === -1) {
        this.clear(false, this.colour);
    }
    else {
        this.clear(false, colour);
    }
}

export { clear, clearWith };
