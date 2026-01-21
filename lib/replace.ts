// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import type { GridPaint as gp } from '../index.js';

// replace all of a certain colour with another
function replace(this: gp, old: number|string, replace: number|string): void {
    if (old === replace) {
        return;
    }

    if (typeof old === 'string') {
        old = this.palette.indexOf(old);
    }

    if (typeof replace === 'string') {
        replace = this.palette.indexOf(replace);
    }

    this.oldPainting = this.painting.splice(0, this.painting.length);
    for (let i = 0; i < this.height; i += 1) {
        this.painting.push([]);
        for (let j = 0; j < this.width; j += 1) {
            const c = this.oldPainting[i][j];
            this.painting[i].push(c === old ? replace : c);
        }
    }

    this.compareChanges();
}

// replace the painting property with one made by the user, properly resizes. should be called early.
// note this deletes history.
function replacePainting(this: gp, painting: gp['painting']): void {
    const newh = painting.length;
    const neww = painting[0].length;
    this.painting = painting;
    if (newh !== this.height) {
        this.height = newh;
        this.canvas.height = this.height * this.cellHeight;
    }
    if (neww !== this.width) {
        this.width = neww;
        this.canvas.width = this.width * this.cellWidth;
    }
    this.undoHistory.length = 0;
    this.redoHistory.length = 0;
}

export { replace, replacePainting };
