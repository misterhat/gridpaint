// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import { bucket } from './bucket.js';
import { clear } from './clear.js';
import { replace } from './replace.js';
import { line, line_approx } from './line.js';

import type { GridPaint as gp } from '../index.js';

const MAX_HISTORY = 64;

function clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

function pushHistory(this: gp, top: number[][][], bottom: number[][][]): void {
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
function apply(this: gp, isApplied?: boolean): void {
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

/** compared oldPainting to painting & push the changes to history
 * @param state any object that returns on undo/redo.
 */
function compare(this: gp): void {
    if (this.oldPainting.length === this.painting.length) {
        if (this.painting.every((el, i) => el.toString() === this.oldPainting[i].toString())) {
            return;
        }
    }

    this.undoHistory.push(clone(this.oldPainting));
    this.undoHistory.splice(0, this.undoHistory.length - MAX_HISTORY);
    this.redoHistory.length = 0;
}


// These tools have action()'s
// as in mousedown cause them to edit the canvas
type GridPaintActionTools =
    'pencil' | 'bucket' | 'line';
type GridPaintTools =
    'clear' | 'undo'  | 'redo';

// fill in grid units one by one
function pencil(this: gp): void {
    const x = this.cursor.x;
    const y = this.cursor.y;

    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.painting[y][x] = this.colour;
    }
}

// redo the last painting action performed (if any)
function redo(this: gp): void {
    pushHistory.apply(
        this, [
            this.redoHistory,
            this.undoHistory,
        ],
    );
}
// undo the last painting action performed (if any)
function undo(this: gp): void {
    pushHistory.apply(
        this, [
            this.undoHistory,
            this.redoHistory,
        ],
    );
}

export {
    /* Action Tools */
    pencil,
    bucket,
    line,

    /* Single Click Action Tools */
    redo,
    undo,
    clear,

    /* These do not have "action()'s" */
    apply,
    replace,
    compare,
    line_approx,
};
export type { GridPaintActionTools, GridPaintTools };
