// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import type { GridPaint as gp } from '../index.js';

function clone_painting(painting: number[][]): number[][] {
    return Array.from(painting, el => el.slice(0));
}

function calcPosition(this: gp, e: PointerEvent) {
    const w = this.width;
    const h = this.height;
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.pageX - rect.left - window.scrollX;
    const y = e.pageY - rect.top - window.scrollY;

    this.cursor.x = Math.floor(x / w * (w / cw));
    this.cursor.y = Math.floor(y / h * (h / ch));
}

type GridPaintEventTargets =
    'pointermove'  | 'pointerdown'  | 'pointerup' |
    'pointerenter' | 'pointerout';

type GridPaintHandlers =
    Record<GridPaintEventTargets, (e: PointerEvent) => void>;

// prevent the browser from allowing you to drag the canvas while drawing near edges.
function dragstart(e: DragEvent): boolean {
    e.preventDefault();
    return false;
}

function Handlers(that: gp): GridPaintHandlers {
    // bind useful drawing functions
    const action = that.action.bind(that);
    const apply = that.applyTool.bind(that);
    const compare = that.compareChanges.bind(that);
    const draw = that.draw.bind(that);
    const calcPos = calcPosition.bind(that);

    return {
        pointermove(e: PointerEvent) {
            e.preventDefault();
            calcPos(e);
            if (that.isApplied) action(true);
        },
        pointerdown(e: PointerEvent) {
            if (e.button !== 0) return;
            calcPos(e);
            // create a clone to compare changes for undo history
            that.oldPainting = clone_painting(that.painting);
            apply(true);
        },
        pointerup(e: PointerEvent) {
            if (e.button !== 0) return;
            if (that.isApplied) {
                apply(false);
                compare();
            }
        },
        pointerenter() {
            if (that.drawing) return;
            else {
                that.drawing = true;
                draw();
            }
        },
        pointerout() {
            that.drawing = false;
        },
    };
}

// activate event handlers
function attach(this: gp): void {
    Object.keys(this.events).forEach(e => {
        this.canvas.addEventListener(
            e as GridPaintEventTargets,
            this.events[e as GridPaintEventTargets],
            false,
        );
    });
    this.canvas.addEventListener('dragstart', dragstart, false);

    // in case the user drags away from the canvas element
    window.addEventListener('pointerup', this.events.pointerup, false);
    window.addEventListener('resize', this.resizeEvent, false);
}

// remove all the event listeners & cease the draw loop
function detach(this: gp): void {
    Object.keys(this.events).forEach(e => {
        this.canvas.removeEventListener(
            e as GridPaintEventTargets,
            this.events[e as GridPaintEventTargets],
            false,
        );
    });
    this.canvas.removeEventListener('dragstart', dragstart, false);

    window.removeEventListener('pointerup', this.events.pointerup, false);
    window.removeEventListener('resize', this.resizeEvent, false);
}

export { Handlers, attach, detach };
export type { GridPaintHandlers };
