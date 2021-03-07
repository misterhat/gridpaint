import type { GridPaint as gp } from '../index';
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
 *   - starting, where previous_point is "unset."
 *   - ending,   where previous_point is set.
 * Initially the function is in the starting state.
 *
 * When called in starting state, the current cursor position
 * will be saved for ending state and will transition to the end state
 * When called in the ending state, the function will draw
 * to the canvas an approximate line between the starting cursor
 * state and the invoking cursor state.
 *
 * An optional parameter can be passed to cancel the end state
 * and restore it to the start state with no effect.
 * @param cancel If true or truthy,
 *               it will cancel the starting line coordinates.
 */
declare function line(this: gp, cancel?: boolean): void;
export { line_approx, line };
