'use strict';

const GridPaint = require('../');

const painter = new GridPaint({ width: 26, height: 15, cellWidth: 16 });
let d, actions, f, t, b;

document.body.appendChild(painter.dom);
d = document.createElement('div');
d.style.marginBottom = '6px';

painter.palette.forEach(function (colour, i) {
    const b = document.createElement('button');
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
    b.innerText = '\xa0';
    b.title = 'switch to ' + colour;
    b.onclick = function () {
        painter.colour = i;
    };
    d.appendChild(b);
});

document.body.appendChild(d);
d = document.createElement('div');

actions = [ 'pencil', 'bucket', 'undo', 'redo', 'clear', 'saveAs' ];
actions.forEach(function (action, i) {
    const b = document.createElement('button');
    b.innerText = action;
    b.onclick = function () {
        if (i < 2) {
            painter.tool = action;
        }
        else {
            painter[action]();
            if (!painter.drawing) painter.draw();
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

painter.init();
