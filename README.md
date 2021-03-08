# gridpaint
A canvas for creating grid-based art in the browser. gridpaint supports dynamic
colour palettes and various tools such as bucket fill and undo.

[![examples/browser.js demonstration](./example.png)](https://adedomin.github.io/gridpaint/docs/index.html)

*Click the image above to test a demonstration!*

You can build/rebuild the example locally with:

    $ npm run build-example
    $ xdg-open docs/index.html

## Installation

    $ npm install --save github:adedomin/gridpaint

### examples/browser.js

For an understanding of how to use GridPaint in the canvas, see:

[examples/browser.js](./examples/browser.js);

It contains documentation on how to use the canvas.

### examples/node.js

To be filled/updated.

![server-sided rendering demonstration](./node.png)

^-- Example of an image made with pureimage on node.

## Properties (Outdated, to be updated.)
All of these properties can be adjusted on the fly and will be applied next
animation frame.

```javascript
painter.width = 16; // painter width (in cells)
painter.height = painter.width; // painter height (in cells)
painter.cellWidth = 16; // the width of each cell
painter.cellHeight = painter.cellWidth; // the height of each cell

painter.background = true; // draw the checkered transparent background
painter.colour = 0; // the currently selected colour
painter.cursor = { x: -1, y: -1 }; // crosshair location
painter.grid = false; // display a contrasted grid over the image
painter.isApplied = false; // the status of mousedown
// colours the image will contain
painter.palette =  [ 'transparent', '#fff', '#c0c0c0', '#808080', '#000',
                     '#f00', '#800', '#ff0', '#808000', '#0f0', '#080', '#0ff',
                     '#008080', '#00f', '#000080', '#f0f', '#800080' ]
// a 2D array painter.height x painter.width of palette indexes
painter.painting = [ [], ... ];
painter.tool = 'pencil'; // the currently selected tool (pencil or bucket)

// stacks of deep-diff changes
painter.undoHistory = [];
painter.redoHistory = [];

// whether or not the draw loop is activated (activated after init() is called)
painter.drawing = true;

painter.dom = HTMLCanvasElement; // the DOM element to append to the document
```

## API (Outdated, to be updated.)
### new GridPaint(options)
Create a new `painter` instance.

`options` is an optional object that can contain the following properties (see
above property definitions for defaults): `{ width, height, cellWidth,
cellHeight, palette }`.

### painter.action()
Apply the current tool to the canvas.

### painter.applyTool([isApplied])
Apply (or unapply) whichever tool is selected to the canvas in the cursor's
current position.

`isApplied` is a `Boolean` value. If not provided, `isApplied` is toggled
instead.

### painter.bucket([replace, x, y])
Fill in surrounding, like-coloured cells.

`replace` is the colour index to replace. If not provided, the colour under `x`
and `y` is used.

`x` and `y` are the coordinates to begin the replacement process. If not
provided, `cursor` position is used.

### painter.clear()
Set all of the cells to the first colour in the palette.

### painter.destroy()
Remove event handlers and cease the draw loop (browser only).

### painter.init()
Initialize event handlers and start the draw loop (browser only).

### painter.pencil()
Set the cell in cursor's position to the selected colour.

### painter.redo()
Redo the last undo action.

### painter.replace(old, replace)
Replace `old` colour with `replace` colour`.

Both arguments can be either the position of a colour on the palette, or a
string of the colour to be `indexOf`'d.

### painter.resize()
Set the painter's <canvas> element to the proper size. Call this if `width`,
`height`, `cellWidth` or `cellHeight` are adjusted.

### painter.saveAs([file, scale])
Export the painting as a PNG file.

`file` is the default filename to save to. Default: `"painting.png"`.

`scale` is a Number that describes what scale to resize the saved canvas (`0.5`
will be half the original, `2` would be twice as large). Default: `1`.

### painter.undo()
Undo the last action since the last tool was applied.

## Events
Events share the same names as the methods that trigger them. The following
methods trigger events:

```javascript
[
    'action',
    'applyTool',
    'clear',
    'move',
    'redo',
    'replace',
    'undo'
]
```

## License
Copyright (C) 2016 Mister Hat

This library is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the Free
Software Foundation; either version 3.0 of the License, or (at your option) any
later version.

This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
