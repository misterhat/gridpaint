'use strict';

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// special event listener for window object
function mouseout(e) {
    if (this.canvas === null) return;
    const canvasRect = this.canvas.getBoundingClientRect();

    if (e.clientX > canvasRect.left &&
        e.clientX < canvasRect.right &&
        e.clientY > canvasRect.top &&
        e.clientY < canvasRect.bottom
    ) {
        if (this.drawing) return;
        this.drawing = true;
        this.draw();
    }
    else {
        this.drawing = false;
    }
}

const handlers = {
    mousemove(e) {
        const w = this.width;
        const h = this.height;
        const cw = this.cellWidth;
        const ch = this.cellHeight;
        let rect = this.canvas.getBoundingClientRect();
        let x = e.pageX - rect.left - window.scrollX;
        let y = e.pageY - rect.top - window.scrollY;

        this.cursor.x = Math.floor(x / w * (w / cw));
        this.cursor.y = Math.floor(y / h * (h / ch));

        if (this.isApplied) {
            this.action();
        }

        this.emit('move');
    },
    mousedown(e) {
        if (e.button !== 0) return;
        // create a clone to compare changes for undo history
        this.oldPainting = clone(this.painting);
        this.applyTool(true);
    },
    mouseup(e) {
        if (e.button !== 0) return;
        if (this.isApplied) {
            this.applyTool(false);
            this.compareChanges();
        }
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
    this.globalEvent = mouseout.bind(that);

    Object.keys(handlers).forEach(function (e) {
        that.events[e] = handlers[e].bind(that);
        that.canvas.addEventListener(e, that.events[e], false);
    });

    // in case the user drags away from the canvas element
    window.addEventListener('mouseup', that.events.mouseup, false);
    // disable drawing when mouse is out of the bounding rectangle
    if (this.autoStopDrawing)
        window.addEventListener('mousemove', mouseout.bind(that), false);
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

    window.removeEventListener('mouseup', that.events.mouseup, false);
    window.removeEventListener('mousemove', that.globalEvent, false);
};
