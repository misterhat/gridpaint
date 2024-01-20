// Copyright (C) 2020  Anthony DeDominic
// See COPYING for License
/** Stateful global for holding the start of a line drawing */
const previous_point = { x: -1, y: -1 };
/**
 * Detect if we are drawing a line or not
 * -1 being a sigil value indicating unset.
 */
function isPrevUnset() {
    return previous_point.x === -1 || previous_point.y === -1;
}
/**
 * Function to set the global line start state of this module.
 * Given the function no parameters sets it back to default: (-1, -1).
 *
 * @param x the x value of the start of the line
 * @param y the y value of the start of the line
 */
function setPrev(x = -1, y = -1) {
    previous_point.x = x;
    previous_point.y = y;
}
/**
 * Returns a series of points that make up and approximate
 * line between a starting point and an end point.
 * If the starting point is unset, the ending point is returned.
 *
 * @param x ending x point.
 * @param y ending y point.
 */
function* line_approx(x, y) {
    if (isPrevUnset()) {
        yield { x, y };
    }
    else {
        let x1 = previous_point.x;
        let y1 = previous_point.y;
        const x2 = x;
        const y2 = y;
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        while (!(x1 === x2 && y1 === y2)) {
            yield { x: x1, y: y1 };
            const err2 = err << 1;
            if (err2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (err2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
        yield { x: x1, y: y1 };
    }
    return;
}
/**
 * Draws a Line from start to finish.
 *
 * This function has two states:
 *   - starting, where previous_point is unset.
 *   - ending,   where previous_point is set.
 * Initially the function is in the starting state.
 *
 * When called in starting state, the current cursor position
 * will be saved and will transition to the ending state.
 *
 * When called in the ending state, the function will draw
 * to the canvas an approximate line from the starting cursor
 * state and the current cursor location.
 *
 * An optional parameter can be passed to reset the state back to start
 *
 * @param cancel If true or truthy,
 *               it will cancel the starting line coordinates.
 */
function line(cancel) {
    if (cancel)
        return setPrev();
    if (isPrevUnset()) {
        setPrev(this.cursor.x, this.cursor.y);
        return;
    }
    else {
        for (const { x, y } of line_approx(this.cursor.x, this.cursor.y)) {
            this.painting[y][x] = this.colour;
        }
        setPrev();
    }
}
export { line_approx, line };
