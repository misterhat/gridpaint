/// <reference types="node" resolution-mode="require"/>
import type { GridPaint as gp } from '../index.js';
/**
 * Export the painting to file.
 *
 * @param [file='painting.png'] The file name.
 * @param [scale=1]             How big to make the image.
 */
declare function save(this: gp, file?: string, scale?: number): Promise<null | Blob | Buffer>;
export { save };
