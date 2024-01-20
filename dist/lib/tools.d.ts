import { bucket } from './bucket.js';
import { clear } from './clear.js';
import { replace } from './replace.js';
import { line, line_approx } from './line.js';
import type { GridPaint as gp } from '../index.js';
declare function apply(this: gp, isApplied?: boolean): void;
/** compared oldPainting to painting & push the changes to history
 * @param state any object that returns on undo/redo.
 */
declare function compare(this: gp): void;
type GridPaintActionTools = 'pencil' | 'bucket' | 'line';
type GridPaintTools = 'clear' | 'undo' | 'redo';
declare function pencil(this: gp): void;
declare function redo(this: gp): void;
declare function undo(this: gp): void;
export { pencil, bucket, line, redo, undo, clear, apply, replace, compare, line_approx, };
export type { GridPaintActionTools, GridPaintTools };
