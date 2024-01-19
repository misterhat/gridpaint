"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPaint = void 0;
const canvas_1 = require("./lib/canvas");
const draw = __importStar(require("./lib/draw"));
const handlers = __importStar(require("./lib/handlers"));
const save_1 = require("./lib/save");
const tools = __importStar(require("./lib/tools"));
const resizers = __importStar(require("./lib/resize"));
const browser_1 = require("./lib/browser");
const DEFAULT_PALETTE = [
    'transparent', '#fff', '#c0c0c0', '#808080', '#000',
    '#f00', '#800', '#ff0', '#808000', '#0f0', '#080',
    '#0ff', '#008080', '#00f', '#000080', '#f0f', '#800080',
];
const DEFAULT_DIMENSION = 16;
class GridPaint {
    constructor(options) {
        this.width = DEFAULT_DIMENSION;
        this.height = DEFAULT_DIMENSION;
        this.cellWidth = DEFAULT_DIMENSION;
        this.cellHeight = DEFAULT_DIMENSION;
        this.origCellW = DEFAULT_DIMENSION;
        this.origCellH = DEFAULT_DIMENSION;
        this.background = true;
        this.grid = false;
        this.outline = false;
        this.isApplied = false;
        this.drawing = false;
        // Index to palette
        this.colour = 0;
        this.gridColour = '#000';
        this.palette = DEFAULT_PALETTE;
        this.cursor = { x: -1, y: -1 };
        this.painting = [[]];
        // Clear tool backup for redo/undo
        this.oldPainting = [[]];
        this.redoHistory = [];
        this.undoHistory = [];
        this.tool = 'pencil';
        this.bucket = tools.bucket;
        this.clear = tools.clear;
        this.pencil = tools.pencil;
        this.line = tools.line;
        this.redo = tools.redo;
        this.undo = tools.undo;
        this.applyTool = tools.apply;
        this.line_approx = tools.line_approx;
        this.replace = tools.replace;
        this.compareChanges = tools.compare;
        this.drawBackground = draw.background;
        this.drawCursor = draw.cursor;
        this.drawGrid = draw.grid;
        this.drawPainting = draw.painting;
        this.draw = draw.tick;
        this.saveAs = save_1.save;
        this.attachHandlers = handlers.attach;
        this.detachHandlers = handlers.detach;
        this.resize = resizers.resize;
        this.fitToWindow = resizers.fitToWindow;
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
        this.canvas = (0, canvas_1.Canvas)(this.width * this.cellWidth, this.height * this.cellHeight);
        const ctx = this.canvas.getContext('2d');
        if (ctx === null) {
            throw new Error('Could not get 2d context');
        }
        this.ctx = ctx;
        this.events = handlers.Handlers(this);
        this.resizeEvent = this.fitToWindow.bind(this);
        if (browser_1.isBrowser) {
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
    init() {
        this.attachHandlers();
        this.fitToWindow();
        // Let pointerenter start this.
        // this.drawing = true;
        this.draw();
    }
    // Destroys the painter, does not remove it from the dom.
    // you have to do that.
    destroy() {
        this.detachHandlers();
        this.drawing = false;
    }
    // Setter that will clear line state for you.
    setTool(tool) {
        this.tool = tool;
        this.line(/* cancel */ true);
    }
    // Perform the current tool's action on the painting.
    // This should ideally be invoked only by an event handler.
    action() {
        switch (this.tool) {
            case 'pencil': return this.pencil();
            case 'bucket': return this.bucket();
            case 'line': return this.line();
            default:
                console.error('<GridPaint>#action() warning: Unknown tool selected: ' +
                    this.tool);
        }
    }
    // These are tools not used (or should be used) in
    // event handlers.
    singleAction(tool) {
        // Assume any pending line drawing is canceled.
        this.line(/* cancel */ true);
        switch (tool) {
            case 'undo': return this.undo();
            case 'redo': return this.redo();
            case 'clear': return this.clear();
            default:
                console.error('<GridPaint>#singleAction() warning: Unknown tool to invoke: ' +
                    tool);
        }
    }
}
exports.GridPaint = GridPaint;
