import type { GridPaint as gp } from '../index';
declare type GridPaintEventTargets = 'pointermove' | 'pointerdown' | 'pointerup' | 'pointerenter' | 'pointerout';
declare type GridPaintHandlers = Record<GridPaintEventTargets, (e: PointerEvent) => void>;
declare function Handlers(that: gp): GridPaintHandlers;
declare function attach(this: gp): void;
declare function detach(this: gp): void;
export { Handlers, attach, detach };
export type { GridPaintHandlers };
