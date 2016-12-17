function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

var handlers = {
    mousemove: function (e) {
        var cw = this.cellWidth,
            ch = this.cellHeight,
            rect = this.canvas.getBoundingClientRect(),
            x = e.pageX - rect.left - window.scrollX,
            y = e.pageY - rect.top - window.scrollY;

        this.cursor.x = Math.floor(x / this.width * (this.width / cw));
        this.cursor.y = Math.floor(y / this.height * (this.height / ch));

        if (this.isApplied) {
            this.action();
        }

        this.emit('move');
    },
    mousedown: function () {
        // create a clone to compare changes for undo history
        this.oldPainting = clone(this.painting);
        this.applyTool(true);
    },
    mouseup: function () {
        if (this.isApplied) {
            this.applyTool(false);
            this.compareChanges();
        }
    }
};

// activate event handlers
module.exports.attach = function () {
    var that;

    if (!process.browser) {
        return;
    }

    that = this;
    this.events = {};

    Object.keys(handlers).forEach(function (e) {
        that.events[e] = handlers[e].bind(that);
        that.canvas.addEventListener(e, that.events[e], false);
    });

    // in case the user drags away from the canvas element
    window.addEventListener('mouseup', that.events.mouseup, false);
};

// remove all the event listeners & cease the draw loop
module.exports.detach = function () {
    var that;

    if (!process.browser) {
        return;
    }

    that = this;

    Object.keys(handlers).forEach(function (e) {
        that.canvas.removeEventListener(e, that.events[e], false);
    });

    window.removeEventListener('mouseup', that.events.mouseup, false);
};
