

import { GridPaint } from './dist/index.js';

// SEE GridPaintOptions for all valid options and their types
const painter = new GridPaint({ width: 40, height: 20 });
let d, b;

// GridPaint#canvas is always an HTMLCanvasElement or in node, a fake one.
// You must attach the canvas somewhere.
document.body.appendChild(painter.canvas);

// palette buttons.
d = document.createElement('div');
d.style.marginBottom = '6px';
// The library does not provide widgets for color picking or tool use and selection.
// below is an example of creating a color picker.
// the painter has a concept of a default palette, which we're using here.
// If you want customer colors, you can define them as an array of css color-like strings.
painter.palette.forEach(function (colour, i /* palette index, needed for painter.colour */) {
    const b = document.createElement('button');
    if (colour !== 'transparent') {
        // your palette should be a list of valid css colors.
        b.style.backgroundColor = colour;
    }
    else {
        // transparency checkerboard.
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
    b.addEventListener('click', function () {
        // GridPaint#colour property is an index into the palette array.
        painter.colour = i;
        // When out of the canvas, GridPaint#drawing is false.
        // The painter only updates when your mouse
        // is in the canvas area
        // This causes it to draw the currently selected
        // colour so the user knows their colour is selected.
        if (!painter.drawing) painter.draw();
    });
    d.appendChild(b);
});

document.body.appendChild(d);

// Tool controls
d = document.createElement('div');

// These are all the tools that have an associated GridPaint#action() or #singleAction(tool)
let actions = [ 'pencil', 'line', 'bezier', 'bucket', 'undo', 'redo', 'clear', 'clear-with', 'saveAs' ];
actions.forEach(function (action) {
    const b = document.createElement('button');
    b.innerText = action;
    b.addEventListener('click', function () {
        switch (action) {
        // These tools should only be set and not directly triggered.
        // They're intended to be triggered by the pointer events.
        // You can trigger them with GridPaint#action() if you need to
        // draw something for the user.
        case 'pencil':
        case 'line':
        case 'bezier':
        case 'bucket':
            // setTool takes care of clearing the line/bezier module's global state.
            painter.setTool(action);
            break;
        // These tools are not handled by pointer events in the canvas.
        // They should be triggered by the user's use of a widget.
        case 'undo':
        case 'redo':
        case 'clear':
        case 'clear-with':
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
    });
    d.appendChild(b);
});

document.body.appendChild(d);

// Replace controls
d = document.createElement('div');

const f = document.createElement('select');
const t = document.createElement('select');
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

// onchange tester
d = document.createElement('div');
let ocp = document.createElement('p');
let chk = document.createElement('input');

ocp.innerText = 'Session Persist\xA0';
ocp.style = 'display: inline-block; margin: 0; padding: 0;';

chk.type = 'checkbox';
chk.onclick = function(e) {
    if (e.target.checked) {
        // use localStorage in your code if you want it to last a bit longer.
        sessionStorage.setItem('painting', JSON.stringify(painter.painting));
        painter.onchange = function() {
            sessionStorage.setItem('painting', JSON.stringify(painter.painting));
        };
    }
    else {
        sessionStorage.clear();
        painter.onchange = function() {};
    }
};

let savedPainting = sessionStorage.getItem('painting');
if (savedPainting !== null) {
    painter.replacePainting(JSON.parse(savedPainting));
    chk.click();
}

d.appendChild(ocp);
d.appendChild(chk);

document.body.appendChild(d);

// Resize controls
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
