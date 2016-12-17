var GridPaint = require('../');

var painter = new GridPaint({ width: 26, height: 15, cellWidth: 16 }),
    d, actions, f, t, b;

document.body.appendChild(painter.dom);
d = document.createElement('div');
d.style.marginBottom = '6px';

painter.palette.forEach(function (colour, i) {
    var b = document.createElement('button');
    b.style.backgroundColor = colour;
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
    var b = document.createElement('button');
    b.innerText = action;
    b.onclick = function () {
        if (i < 2) {
            painter.tool = action;
        } else {
            painter[action]();
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
    var selects = document.getElementsByTagName('select');
    painter.replace(selects[0].value, selects[1].value);
};

painter.palette.forEach(function (c) {
    var oF = new Option(c),
        oT = new Option(c);

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
