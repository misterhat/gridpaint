'use strict';

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function calcPosition(e) {
    const w = this.width;
    const h = this.height;
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    let rect = this.canvas.getBoundingClientRect();
    let x = e.pageX - rect.left - window.scrollX;
    let y = e.pageY - rect.top - window.scrollY;

    this.cursor.x = Math.floor(x / w * (w / cw));
    this.cursor.y = Math.floor(y / h * (h / ch));
}

const handlers = {
    pointermove(e) {
        e.preventDefault();
        calcPosition.apply(this, [ e ]);
        if (this.isApplied) this.action();
        this.emit('move');
    },
    pointerdown(e) {
        if (e.button !== 0) return;
        calcPosition.apply(this, [ e ]);
        // create a clone to compare changes for undo history
        this.oldPainting = clone(this.painting);
        this.applyTool(true);
    },
    pointerup(e) {
        if (e.button !== 0) return;
        if (this.isApplied) {
            this.applyTool(false);
            this.compareChanges();
        }
    },
    pointerenter() {
        if (this.drawing) return;
        else {
            this.drawing = true;
            this.draw();
        }
    },
    pointerout() {
        this.drawing = false;
    },
};

// activate event handlers
module.exports.attach = function () {
    let that;

    if (!process.browser) {
        return;
    }

    that = this;
    this.events = {};
    this.resizeEvent = this.fitToWindow.bind(this);

    Object.keys(handlers).forEach(function (e) {
        that.events[e] = handlers[e].bind(that);
        that.canvas.addEventListener(e, that.events[e], false);
    });

    // in case the user drags away from the canvas element
    window.addEventListener('pointerup', that.events.pointerup, false);
    window.addEventListener('resize', this.resizeEvent, false);
};

// remove all the event listeners & cease the draw loop
module.exports.detach = function () {
    let that;

    if (!process.browser) {
        return;
    }

    that = this;

    Object.keys(handlers).forEach(function (e) {
        that.canvas.removeEventListener(e, that.events[e], false);
    });

    window.removeEventListener('pointerup', that.events.pointerup, false);
    window.removeEventListener('resize', this.resizeEvent, false);
};
