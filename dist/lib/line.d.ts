import type { GridPaint as gp } from '../index.js';
/**
 * Returns a series of points that make up and approximate
 * line between a starting point and an end point.
 * If the starting point is unset, the ending point is returned.
 *
 * @param x ending x point.
 * @param y ending y point.
 */
declare function line_approx(x: number, y: number): Generator<gp['cursor'], undefined, undefined>;
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
declare function line(this: gp, cancel?: boolean): void;
export { line_approx, line };
