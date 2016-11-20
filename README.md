# gridpaint
A canvas for creating grid-based art in the browser. gridpaint supports dynamic
colour palettes and various tools such as bucket fill and undo.

## Installation

    $ npm install --save gridpaint

## Example
```javascript
var GridPaint = require('./');

var painter = new GridPaint({ width: 26, height: 15, cellWidth: 16 }),
    d, actions;

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

painter.init();
```

## Properties
All of these properties can be adjusted on the fly and will be applied next
animation frame.

```javascript
painter.width = 16; // painter width (in cells)
painter.height = painter.width; // painter height (in cells)
painter.cellWidth = 16; // the width of each cell
painter.cellHeight = painter.cellWidth; // the height of each cell

// colours the image will contain
painter.palette =  [ 'transparent', '#fff', '#c0c0c0', '#808080', '#000',
                     '#f00', '#800', '#ff0', '#808000', '#0f0', '#080', '#0ff',
                     '#008080', '#00f', '#000080', '#f0f', '#800080' ]

// a 2D array painter.height x painter.width of palette indexes
painter.painting = [ [], ... ];
painter.cursor = { x: -1, y: -1 }; // crosshair location
painter.colour = 0; // the currently selected colour
painter.isApplied = false; // the status of mousedown
painter.tool = 'pencil'; // the currently selected tool (pencil or bucket)
painter.grid = false; // display a contrasted grid over the image

// stacks of deep-diff changes
painter.undoHistory = [];
painter.redoHistory = [];

painter.dom = HTMLCanvasElement; // the DOM element to append to the document
```

## API
### GridPaint(options)
Create a new `painter` instance.

`options` is an optional object that can contain the following properties (see
above property definitions for defaults): `{ width, height, cellWidth,
cellHeight, palette }`.

### painter.resize()
Set the painter's <canvas> element to the proper size. Call this if `width`,
`height`, `cellWidth` or `cellHeight` are adjusted.

### painter.clear()
Set all of the cells to the first colour in the palette.

### painter.applyTool([isApplied])
Apply (or unapply) whichever tool is selected to the canvas in the cursor's
current position.

`isApplied` is a `Boolean` value. If not provided, `isApplied` is toggled
instead.

### painter.pencil()
Set the cell in cursor's position to the selected colour.

### painter.bucket([replace, x, y])
Fill in surrounding, like-coloured cells.

`replace` is the colour index to replace. If not provided, the colour under `x`
and `y` is used.

`x` and `y` are the coordinates to begin the replacement process. If not
provided, `cursor` position is used.

### painter.undo()
Undo the last action since the last tool was applied.

### painter.redo()
Redo the last undo action.

### painter.action()
Apply the current tool to the canvas.

### painter.saveAs([file, scale])
Export the painting as a PNG file.

`file` is the filename to prompt the user with.

`scale` is a Number that describes what scale to resize the saved canvas (`0.5`
will be half the original, `2` would be twice as large).

## Events
Events share the same names as the methods that trigger them. The following
methods trigger events:

```javascript
[ 'clear', 'applyTool', 'undo', 'redo', 'action', 'move' ]
```

## License
Copyright (C) 2016 Mister Hat

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.
