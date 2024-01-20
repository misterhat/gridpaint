import type { GridPaint as gp } from '../index.js';
/** Draw the checkered pattern to indicate transparency. */
declare function background(this: gp): void;
/**
 * Overlap the current colour as a crosshair over the position it will be
 * applied to.
 * If this.previous_point is defined, this draws a Line of cursors to current
 * cursor point.
 */
declare function cursor(this: gp): void;
/** Draw contrasting grid units. */
declare function grid(this: gp): void;
/**
 * Draw the grid units onto a canvas.
 *
 * @param scale size scaling, probably useless
 * @param ctx   the canvas context to draw on.
 */
declare function painting(this: gp, scale?: number, ctx?: CanvasRenderingContext2D): void;
/** Draw loop. */
declare function tick(this: gp): void;
export { background, cursor, grid, painting, tick };
