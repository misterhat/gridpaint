import type { GridPaint as gp } from '../index';
declare function background(this: gp): void;
declare function cursor(this: gp): void;
declare function grid(this: gp): void;
/**
 * Draw the grid units onto a canvas.
 *
 * @param scale size scaling, probably useless
 * @param ctx   the canvas context to draw on.
 */
declare function painting(this: gp, scale?: number, ctx?: CanvasRenderingContext2D): void;
declare function tick(this: gp): void;
export { background, cursor, grid, painting, tick };
