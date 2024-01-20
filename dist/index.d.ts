import * as draw from './lib/draw.js';
import type { GridPaintHandlers } from './lib/handlers.js';
import * as handlers from './lib/handlers.js';
import { save } from './lib/save.js';
import type { GridPaintTools, GridPaintActionTools } from './lib/tools.js';
import * as tools from './lib/tools.js';
import * as resizers from './lib/resize.js';
interface GridPaintOptions {
    width?: number;
    height?: number;
    cellWidth?: number;
    cellHeight?: number;
    palette?: string[];
    outline?: boolean;
}
declare class GridPaint {
    width: number;
    height: number;
    cellWidth: number;
    cellHeight: number;
    origCellW: number;
    origCellH: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    background: boolean;
    grid: boolean;
    outline: boolean;
    isApplied: boolean;
    drawing: boolean;
    colour: number;
    gridColour: string;
    palette: string[];
    cursor: {
        x: number;
        y: number;
    };
    painting: number[][];
    oldPainting: number[][];
    redoHistory: number[][][];
    undoHistory: number[][][];
    events: GridPaintHandlers;
    resizeEvent: (this: GridPaint) => void;
    tool: GridPaintActionTools;
    boundDraw: (this: GridPaint) => void;
    constructor(options: GridPaintOptions);
    /** Sets up the painter for drawing */
    init(): void;
    /** Destroys the painter, does not remove it from the dom.
        you have to do that. */
    destroy(): void;
    /** Setter that will clear line state for you. */
    setTool(tool: GridPaintActionTools): void;
    /** Perform the current tool's action on the painting.
        This should ideally be invoked only by an event handler. */
    action(): void;
    /** These are tools not used (or should be used) in
        event handlers. */
    singleAction(tool: GridPaintTools): void;
    bucket: typeof tools.bucket;
    clear: typeof tools.clear;
    pencil: typeof tools.pencil;
    line: typeof tools.line;
    redo: typeof tools.redo;
    undo: typeof tools.undo;
    applyTool: typeof tools.apply;
    line_approx: typeof tools.line_approx;
    replace: typeof tools.replace;
    compareChanges: typeof tools.compare;
    drawBackground: typeof draw.background;
    drawCursor: typeof draw.cursor;
    drawGrid: typeof draw.grid;
    drawPainting: typeof draw.painting;
    draw: typeof draw.tick;
    saveAs: typeof save;
    attachHandlers: typeof handlers.attach;
    detachHandlers: typeof handlers.detach;
    resize: typeof resizers.resize;
    fitToWindow: typeof resizers.fitToWindow;
}
export { GridPaint };
