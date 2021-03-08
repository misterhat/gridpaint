// Copyright (C) 2017  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import type { GridPaint as gp } from '../index';

// Empty all of the grid units.
// Technically also initializes painting and oldPainting
function clear(this: gp, init = false): void {
    // Have to preserve array, empties it in-place.
    // Also backs up the array, by setting it to oldPainting
    // this is for undo history
    this.oldPainting = this.painting.splice(0, this.painting.length);
    for (let i = 0; i < this.height; ++i) {
        this.painting.push([]);
        for (let j = 0; j < this.width; ++j) {
            this.painting[i].push(0);
        }
    }
    if (init) this.oldPainting = this.painting;
    this.line(/* cancel any line action */ true);
    this.compareChanges();
}

export { clear };
