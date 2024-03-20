'use strict';

import { GridPaint } from '../index.js';

// SEE GridPaintOptions for all valid options and their types
const painter = new GridPaint({ width: 40, height: 20 });
let d, actions, f, t, b;

// GridPaint#canvas is always an HTMLCanvasElement or in node, it's a faux one
// That supports getting a 2d context.
//
// You are on your own in terms of attaching it to the dom and managing it.
// GridPaint#destroy() will detach all event listeners
document.body.appendChild(painter.canvas);
d = document.createElement('div');
d.style.marginBottom = '6px';

// You need to bring your own color picker for the canvas
// you have in the painter.
// This uses the default defined in GridPaint since
// one was not explicitly given
// An array of type string[] where string is a valid css color.
// The painter uses an index into the palette to set an internal
// array which is used to render the appropriate colors onto a canvas
painter.palette.forEach(function (colour, i) {
    const b = document.createElement('button');
    // How you display your colors in the pickers is on you
    // Here I just use them as css colors, or in the transparent case
    // my own checkered pattern
    if (colour !== 'transparent') {
        b.style.backgroundColor = colour;
    }
    else {
        b.style.backgroundImage = `
          linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999 100%),
          linear-gradient(-45deg, #999 25%, #666 25%, #666 75%, #999 75%, #999 100%)
        `;
        b.style.backgroundSize = '0.5em 0.5em';
    }
    b.style.border = '1px solid #000';
    b.style.marginRight = '4px';
    b.style.color = 'white';
    b.innerText = '\xA0';
    b.title = 'switch to ' + colour;
    b.onclick = function () {
        // where colour is an index into GridPaint#palette
        painter.colour = i;
        // When out of the canvas, GridPaint#drawing is false.
        // The painter only updates when your mouse
        // is in the canvas area
        // This causes it to draw the currently selected
        // colour so the user knows their colour is selected.
        if (!painter.drawing) painter.draw();
    };
    d.appendChild(b);
});

document.body.appendChild(d);
d = document.createElement('div');

// These are all the tools that have an associated GridPaint#action() or #singleAction(tool)
actions = [ 'pencil', 'line', 'bucket', 'undo', 'redo', 'clear', 'clear-with', 'saveAs' ];
// Like the color picking, you are on your own for tool picking.
actions.forEach(function (action) {
    const b = document.createElement('button');
    b.innerText = action;
    b.onclick = function () {
        switch (action) {
        // These first three tools (pencil, line, bucket)
        // should only be applied by the pointerdown/move
        // event handler, it makes little sense to manually
        // action() these unless you are drawing something for the user.
        case 'pencil':
        case 'line':
        case 'bucket':
            // If you assign directly to tool, you will need
            // to consider clearing any pending line drawing state.
            painter.setTool(action);
            break;
        case 'undo':
        case 'redo':
        case 'clear':
        case 'clear-with':
            // The remaining tools, sans saveAs
            // generally should not be invoked on mousedown
            // so the function GridPaint#singleAction() exists
            // that takes the tool's name
            painter.singleAction(action);
            // When out of the canvas, GridPaint#drawing is false.
            // These tools transform the underlying painting
            // but while out of the canvas, the canvas is never
            // updated. You probably want to call GridPaint#draw()
            // manually when invoking single actions.
            if (!painter.drawing) painter.draw();
            break;
        case 'saveAs':
            // The last tool, saveAs takes an optional parameter
            // of a file name and should be invoked like this.
            painter.saveAs(/* filename */);
        }
    };
    d.appendChild(b);
});

document.body.appendChild(d);
d = document.createElement('div');

f = document.createElement('select');
t = document.createElement('select');
b = document.createElement('button');

b.innerText = 'replace';
b.onclick = function () {
    const selects = document.getElementsByTagName('select');
    painter.replace(selects[0].value, selects[1].value);
    if (!painter.drawing) painter.draw();
};

painter.palette.forEach(function (c) {
    const oF = new Option(c);
    const oT = new Option(c);

    oF.style.backgroundColor = c;
    oT.style.backgroundColor = c;
    f.appendChild(oF);
    t.appendChild(oT);
});

d.appendChild(f);
d.appendChild(t);
d.appendChild(b);
document.body.appendChild(d);
d = document.createElement('div');

const pw = document.createElement('p');
const rw = document.createElement('input');
const ph = document.createElement('p');
const rh = document.createElement('input');
const rb = document.createElement('button');

pw.innerText = 'width\xA0';
pw.style = 'display: inline-block; margin: 0; padding: 0;';
rw.value = painter.width.toString();
rw.type = 'number';

ph.innerText = '\xA0height\xA0';
ph.style = 'display: inline-block; margin: 0; padding: 0;';
rh.value = painter.height.toString();
rh.type = 'number';

rb.innerText = 'resize';
rb.onclick = function() {
    const w = +rw.value;
    const h = +rh.value;
    painter.resizePainting(w, h);
};


d.appendChild(pw);
d.appendChild(rw);
d.appendChild(ph);
d.appendChild(rh);
d.appendChild(rb);

document.body.appendChild(d);

// Init attaches all event handlers and also automatically
// resizes the canvas to fit within the bounds of its parentElement
//
// You should invoke this once attached or manaually call
// GridPaint#fitToWindow once it is attached.
painter.init();
