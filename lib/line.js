// Draw a line between two points

'use strict';

let previous_point = { x: -1, y: -1 };

function isPrevUnset() {
    return previous_point.x === -1 || previous_point.y === -1;
}

function setPrev(x = -1, y = -1) {
    previous_point.x = x;
    previous_point.y = y;
}

module.exports.line_approx = function* (x,y) {
    if (isPrevUnset()) return yield { x, y };

    let x1 = previous_point.x;
    let y1 = previous_point.y;
    const x2 = x;
    const y2 = y;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (!(x1 === x2 && y1 === y2)) {
        yield { x: x1, y: y1 };
        const err2 = err << 1;
        if (err2 > -dy) {
            err -= dy;
            x1  += sx;
        }
        if (err2 < dx) {
            err += dx;
            y1  += sy;
        }
    }
    return yield { x: x1, y: y1 };
};

module.exports.line = function (cancel) {
    if (cancel) return setPrev();

    if (isPrevUnset()) {
        setPrev(this.cursor.x, this.cursor.y);
        return;
    }
    else {
        for (const { x, y } of exports.line_approx(this.cursor.x, this.cursor.y)) {
            this.painting[y][x] = this.colour;
        }
        setPrev();
    }
};
