// Copyright (C) 2017  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import type { GridPaint as gp } from '../index.js';

// Set all grid elements to a given color or initialize the painting.
function clear(this: gp, init = false, default_colour = 0): void {
    this.oldPainting = this.painting.splice(0, this.painting.length);
    for (let i = 0; i < this.height; ++i) {
        this.painting.push([]);
        for (let j = 0; j < this.width; ++j) {
            this.painting[i].push(default_colour);
        }
    }
    if (init) this.oldPainting = this.painting;
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
