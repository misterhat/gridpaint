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

import { Canvas } from './lib/canvas';
import * as draw from './lib/draw';
import type { GridPaintHandlers } from './lib/handlers';
import * as handlers from './lib/handlers';
import { save } from './lib/save';
import type { GridPaintTools, GridPaintActionTools } from './lib/tools';
import * as tools from './lib/tools';
import * as resizers from './lib/resize';
import { isBrowser } from './lib/browser';

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
    outline: boolean,
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
    painting: number[][] = [[]];
    // Clear tool backup for redo/undo
    oldPainting: number[][] = [[]];
    redoHistory: number[][][] = [];
    undoHistory: number[][][] = [];

    events: GridPaintHandlers;
    resizeEvent: (this: GridPaint) => void;

    tool: GridPaintActionTools = 'pencil';

    boundDraw: (this: GridPaint) => void;

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
        if (options.palette !== undefined && options.palette.length > 0)
            this.palette = options.palette;

        this.canvas = Canvas(
            this.width * this.cellWidth,
            this.height * this.cellHeight,
        );
        const ctx = this.canvas.getContext('2d');
        if (ctx === null) {
            throw new Error('Could not get 2d context');
        }
        this.ctx = ctx;

        this.events = handlers.Handlers(this);
        this.resizeEvent = this.fitToWindow.bind(this);

        if (isBrowser) {
            this.canvas.className = 'gridpaint-canvas';
            this.canvas.style.cursor = 'crosshair';
            this.canvas.style.touchAction = 'none';

            if (/firefox/i.test(navigator.userAgent)) {
                this.canvas.style.imageRendering = '-moz-crisp-edges';
            }
            else {
                this.canvas.style.imageRendering = 'pixelated';
            }

            if (this.outline) {
                this.canvas.style.outlineStyle = 'solid';
                this.canvas.style.outlineWidth = '2px';
            }
        }

        // Used for requestAnimationFrame
        this.boundDraw = this.draw.bind(this);
        // init painting.
        this.clear(/* init */ true);
    }

    // Sets up the painter for drawing
    init(): void {
        this.attachHandlers();
        this.fitToWindow();
        // Let pointerenter start this.
        // this.drawing = true;
        this.draw();
    }

    // Destroys the painter, does not remove it from the dom.
    // you have to do that.
    destroy(): void {
        this.detachHandlers();
        this.drawing = false;
    }

    // Setter that will clear line state for you.
    setTool(tool: GridPaintActionTools): void {
        this.tool = tool;
        this.line(/* cancel */ true);
    }

    // Perform the current tool's action on the painting.
    // This should ideally be invoked only by an event handler.
    action(): void {
        switch (this.tool) {
        case 'pencil': return this.pencil();
        case 'bucket': return this.bucket();
        case 'line':   return this.line();
        default:
            console.error(
                '<GridPaint>#action() warning: Unknown tool selected: ' +
                this.tool,
            );
        }
    }

    // These are tools not used (or should be used) in
    // event handlers.
    singleAction(tool: GridPaintTools): void {
        // Assume any pending line drawing is canceled.
        this.line(/* cancel */ true);
        switch (tool) {
        case 'undo':  return this.undo();
        case 'redo':  return this.redo();
        case 'clear': return this.clear();
        default:
            console.error(
                '<GridPaint>#singleAction() warning: Unknown tool to invoke: ' +
                tool,
            );
        }
    }

    bucket = tools.bucket;
    clear = tools.clear;
    pencil = tools.pencil;
    line = tools.line;
    redo = tools.redo;
    undo = tools.undo;

    applyTool = tools.apply;
    line_approx = tools.line_approx;
    replace = tools.replace;
    compareChanges = tools.compare;

    drawBackground = draw.background;
    drawCursor = draw.cursor;
    drawGrid = draw.grid;
    drawPainting = draw.painting;
    draw = draw.tick;

    saveAs = save;

    attachHandlers = handlers.attach;
    detachHandlers = handlers.detach;

    resize = resizers.resize;
    fitToWindow = resizers.fitToWindow;
}

export { GridPaint };
