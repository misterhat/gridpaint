/*
 * gridpaint - a canvas for creating grid-based art in the browser
 * Copyright (C) 2016 Zorian Medwin
 * Copyright (C) 2020 Anthony DeDominic
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

import { Canvas } from './lib/canvas.js';
import * as draw from './lib/draw.js';
import type { GridPaintHandlers } from './lib/handlers.js';
import * as handlers from './lib/handlers.js';
import { save } from './lib/save.js';
import type { GridPaintTools, GridPaintActionTools } from './lib/tools.js';
import * as tools from './lib/tools.js';
import * as resizers from './lib/resize.js';
import { isBrowser } from './lib/browser.js';

function noop(this: GridPaint): void {}

const DEFAULT_PALETTE: string[] = [
    'transparent', '#fff', '#c0c0c0', '#808080', '#000',
    '#f00', '#800', '#ff0', '#808000', '#0f0', '#080',
    '#0ff', '#008080', '#00f', '#000080', '#f0f', '#800080',
];

const DEFAULT_DIMENSION = 16;

interface GridPaintOptions {
    width?: number,
    height?: number,
    cellWidth?: number,
    cellHeight?: number,
    palette?: string[],
    outline?: boolean,
    grid?: boolean,
    colour?: number,
    onchange: (this: GridPaint) => void,
}

class GridPaint {
    width = DEFAULT_DIMENSION;
    height = DEFAULT_DIMENSION;

    cellWidth = DEFAULT_DIMENSION;
    cellHeight = DEFAULT_DIMENSION;
    origCellW = DEFAULT_DIMENSION;
    origCellH = DEFAULT_DIMENSION;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    background = true;
    grid = false;
    outline = false;
    isApplied = false;
    drawing = false;

    // Index to palette
    colour = 0;
    gridColour = '#000';
    palette: string[] = DEFAULT_PALETTE;
    cursor = { x: -1, y: -1 };
    control_points: ReadonlyArray<this['cursor']> =  [ { x: -1, y: -1 }, { x: -1, y: -1 } ];
    painting: number[][] = [[]];
    // Clear tool backup for redo/undo
    oldPainting: number[][] = [[]];
    redoHistory: number[][][] = [];
    undoHistory: number[][][] = [];

    events: GridPaintHandlers;
    resizeEvent: (this: GridPaint) => void;

    tool: GridPaintActionTools = 'pencil';

    boundDraw: (this: GridPaint) => void;

    // allow user to react to changes to the canvas, such as persisting it.
    onchange: (this: GridPaint) => void = noop;

    constructor(options: GridPaintOptions) {
        if (options.width !== undefined)
            this.width = options.width;
        if (options.height !== undefined)
            this.height = options.height;
        if (options.cellWidth !== undefined)
            this.cellWidth = options.cellWidth;
        if (options.cellHeight !== undefined)
            this.cellHeight = options.cellHeight;
        if (options.outline !== undefined)
            this.outline = options.outline;
        if (options.grid !== undefined)
            this.grid = options.grid;
        if (options.palette !== undefined && options.palette.length > 0)
            this.palette = options.palette;
        if (options.colour !== undefined)
            this.colour = options.colour;
        if (options.onchange !== undefined)
            this.onchange = options.onchange;

        this.canvas = Canvas(
            this.width * this.cellWidth,
            this.height * this.cellHeight,
        );

        this.resizeEvent = this.fitToWindow.bind(this);
        this.events = handlers.Handlers(this);

        if (isBrowser) {
            const ctx = this.canvas.getContext('2d');
            if (ctx === null) {
                throw new Error('Could not get 2d context');
            }
            this.ctx = ctx;
            this.canvas.className = 'gridpaint-canvas';
            this.canvas.style.cursor = 'crosshair';
            this.canvas.style.touchAction = 'none';
            // firefox should support this now.
            this.canvas.style.imageRendering = 'pixelated';

            if (this.outline) {
                this.canvas.style.outlineStyle = 'solid';
                this.canvas.style.outlineWidth = '2px';
            }
        }
        else {
            this.ctx = null as any;
        }

        // Used for requestAnimationFrame
        this.boundDraw = this.draw.bind(this);

        // init painting.
        this.clear(/* init */ true, /* default_color */ this.colour);
    }

    /** Sets up the painter for drawing */
    init(): void {
        this.attachHandlers();
        this.fitToWindow();
        // Let pointerenter start this.
        // this.drawing = true;
        this.draw();
    }

    /** Destroys the painter, does not remove it from the dom.
        you have to do that. */
    destroy(): void {
        this.detachHandlers();
        this.drawing = false;
    }

    /** Setter that will clear line state for you. */
    setTool(tool: GridPaintActionTools): void {
        this.tool = tool;
        this.line(/* cancel */ true);
    }

    /** Perform the current tool's action on the painting.
        This should ideally be invoked only by an event handler. */
    action(pointermove?: boolean): void {
        switch (this.tool) {
        case 'pencil': return this.pencil();
        case 'bucket': return this.bucket();
        case 'line':
            if (!pointermove) return this.line();
            break;
        case 'bezier':
            if (!pointermove) return this.line(/* cancel */ false, /* bezier */ true);
            break;
        default:
            console.error(
                '<GridPaint>#action() warning: Unknown tool selected: ' +
                this.tool,
            );
        }
    }

    /** These are tools not used (or should be used) in
        event handlers. */
    singleAction(tool: GridPaintTools): void {
        // Assume any pending line drawing is canceled.
        this.line(/* cancel */ true);
        switch (tool) {
        case 'undo':  return this.undo();
        case 'redo':  return this.redo();
        case 'clear': return this.clear();
        case 'clear-with': return this.clearWith();
        default:
            console.error(
                '<GridPaint>#singleAction() warning: Unknown tool to invoke: ' +
                tool,
            );
        }
    }

    bucket = tools.bucket;
    clear = tools.clear;
    clearWith = tools.clearWith;

    pencil = tools.pencil;
    line = tools.line;
    redo = tools.redo;
    undo = tools.undo;

    applyTool = tools.apply;
    line_approx = tools.line_approx;
    replace = tools.replace;
    replacePainting = tools.replacePainting;
    compareChanges = tools.compare;

    drawBackground = isBrowser ? draw.background : noop;
    drawCursor = isBrowser ? draw.cursor : noop;
    drawGrid = isBrowser ? draw.grid : noop;
    drawPainting = isBrowser ? draw.painting : noop;
    draw = isBrowser ? draw.tick : noop;

    saveAs = save;

    attachHandlers = isBrowser ? handlers.attach : noop;
    detachHandlers = isBrowser ? handlers.detach : noop;

    resize = resizers.resize;
    resizePainting = resizers.resizePainting;
    fitToWindow = isBrowser ? resizers.fitToWindow : noop;
}

export { GridPaint };
