// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
import { isBrowser } from './browser.js';
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function calcPosition(e) {
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
function Handlers(that) {
    // bind useful drawing functions
    const action = that.action.bind(that);
    const apply = that.applyTool.bind(that);
    const compare = that.compareChanges.bind(that);
    const draw = that.draw.bind(that);
    const calcPos = calcPosition.bind(that);
    return {
        pointermove(e) {
            e.preventDefault();
            calcPos(e);
            if (that.isApplied)
                action();
        },
        pointerdown(e) {
            if (e.button !== 0)
                return;
            calcPos(e);
            // create a clone to compare changes for undo history
            that.oldPainting = clone(that.painting);
            apply(true);
        },
        pointerup(e) {
            if (e.button !== 0)
                return;
            if (that.isApplied) {
                apply(false);
                compare();
            }
        },
        pointerenter() {
            if (that.drawing)
                return;
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
function attach() {
    if (!isBrowser)
        return;
    Object.keys(this.events).forEach(e => {
        this.canvas.addEventListener(e, this.events[e], false);
    });
    // in case the user drags away from the canvas element
    window.addEventListener('pointerup', this.events.pointerup, false);
    window.addEventListener('resize', this.resizeEvent, false);
}
// remove all the event listeners & cease the draw loop
function detach() {
    if (!isBrowser)
        return;
    Object.keys(this.events).forEach(e => {
        this.canvas.removeEventListener(e, this.events[e], false);
    });
    window.removeEventListener('pointerup', this.events.pointerup, false);
    window.removeEventListener('resize', this.resizeEvent, false);
}
export { Handlers, attach, detach };
