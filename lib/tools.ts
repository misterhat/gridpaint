// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import * as deepDiff from 'deep-diff';

import { bucket } from './bucket';
import { clear } from './clear';
import { replace } from './replace';
import { line, line_approx } from './line';

import type { GridPaint as gp } from '../index';

const MAX_HISTORY = 99;

function clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

function pushHistory(this: gp, top: any, bottom: any, doChange: any): void {
    if (!top.length) {
        return;
    }

    const changes = top.pop();

    bottom.push(clone(changes));

    if (!changes) {
        return;
    }

    changes.forEach((change: any) => {
        doChange(this.painting, this.painting, change);
    });
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

// compared oldPainting to painting & push the changes to history
function compare(this: gp): void {
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


// These tools have action()'s
// as in mousedown cause them to edit the canvas
type GridPaintActionTools =
    'pencil' | 'bucket' | 'line';
type GridPaintTools =
    'clear' | 'undo'  | 'redo';

// fill in grid units one by one
function    pencil(this: gp): void {
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
            deepDiff.applyChange,
        ],
    );
}
// undo the last painting action performed (if any)
function undo(this: gp): void {
    pushHistory.apply(
        this, [
            this.undoHistory,
            this.redoHistory,
            deepDiff.revertChange,
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
