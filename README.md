# gridpaint
A canvas for creating grid-based art in the browser. gridpaint supports dynamic
colour palettes and various tools such as bucket fill and undo.

[![examples/browser.js demonstration](./example.png)](https://adedomin.github.io/gridpaint/docs/index.html)

*Click the image above to test a demonstration!*

You can build/rebuild the example locally with:

    $ npm run prepack
    $ npm run test-browser

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

## Public properties of a GridPaint instance
All of these properties can be adjusted on the fly and will be applied next
animation frame.

```javascript
painter.width = 16; // painter width (in cells)
painter.height = painter.width; // painter height (in cells)
painter.cellWidth = 16; // the width of each cell
painter.cellHeight = painter.cellWidth; // the height of each cell

painter.background = true; // draw the checkered transparent background
painter.colour = 0; // the currently selected colour in a palette; is an index.
painter.cursor = { x: -1, y: -1 }; // crosshair location; more for the event handlers.
painter.grid = false; // display grid lines that visually separate individual cells.
painter.isApplied = false; // the status of mousedown
// colours the image will contain
painter.palette =  [ 'transparent', '#fff', '#c0c0c0', '#808080', '#000',
                     '#f00', '#800', '#ff0', '#808000', '#0f0', '#080', '#0ff',
                     '#008080', '#00f', '#000080', '#f0f', '#800080' ]
// 2D array: painting[row][column]. values in columns are an index into the current painter.palette.
painter.painting = [ [], ... ];
painter.tool = 'pencil'; // the currently selected tool (pencil or bucket)

// Arrays containing copies of previous instances of painter.painting.
painter.undoHistory = [];
painter.redoHistory = [];

// whether or not the draw loop is activated (activated after init() is called)
painter.drawing = true;

painter.canvas = HTMLCanvasElement; // the DOM element to append to the document
```

## API
### new GridPaint(options)
Create a new `painter` instance.

`options` is an optional object that can contain the following properties (see
above property definitions for defaults):
```typescript
interface GridPaintOptions {
    width?: number,
    height?: number,
    cellWidth?: number,
    cellHeight?: number,
    palette?: string[],
    outline?: boolean,
    grid?: boolean,
    colour?: number,
}
```
### painter.action()
Apply the current tool, at the current painter.cursor, to the canvas.

Only GridPaintActionTools can be used:
```typescript
type GridPaintActionTools =
    'pencil' | 'bucket' | 'line';
```

Usage example:
```javascript
painter.setTool('pencil');
painter.cursor = { x: 1, y: 2 };
painter.action();
```

### painter.applyTool([isApplied])
Apply (or unapply) whichever tool is selected to the canvas in the cursor's
current position. This is more a conveinence for built-in Event handling code
and users will likely not use or want this.

`isApplied` is a `Boolean` value. If not provided, `isApplied` is toggled
instead.

### painter.bucket([replace, x, y])
Fill in surrounding, like-coloured cells.

`replace` is the colour index to replace. If not provided, the `colour` currently 
set is used.

`x` and `y` are the coordinates to begin the replacement process. If not
provided, `cursor.x` and `cursor.y` is used.

### painter.clear([init, default_colour])
effectively delete the painting and replace every cell to a specific color.

`init` is used to initialize the painting, do not set or set it to false.

`default_colour` the color to set every cell in the painting with.
The default value is 0.

### painter.clearWith([colour])
This is a convenience wrapper around painter.clear which sets init to false and
if `colour` is not given, the current `painter.colour` is used instead.

### painter.compare()
After making changes to a painting (outside of event handlers) you can use this
to detect and push changes to the history.

### painter.destroy()
Remove event handlers and cease the draw loop (browser only).

### painter.init()
Initialize event handlers and start the draw loop (browser only).

### painter.pencil()
Set the cell in cursor's position to the selected colour.

### painter.redo()
Redo the last undo action.

### painter.replace(old, replace)
Replace `old` colour with `replace` colour.

Both arguments can be either the position of a colour on the palette, or a
string of the colour to be `indexOf`'d.

### painter.fitToWindow()
Adjusts the cellWidth and heights to make the canvas fit its parent
element's size.

### painter.resize([w, h])
Resize the `painter.cellWidth` to `w` and `painter.cellHeight` to `h`.
This also resizes the html `<canvas>` element that gridpaint uses.
This is usually not used, consider `painter.fitToWindow()` instead.

### painter.resizePainting([w, h, default_colour])
*NOT TO BE CONFUSED WITH* `painter.resize()`.
Physically grow or shrink the `painter.painting`.
The function will attempt to center the existing content in the painting.
Any new cells will be initialized with the colour of `default_colour`.
If `default_colour` is not specified, `0` is used.

Notes: undo and redo may grow or shrink your `painting` so be careful carrying

### painter.saveAs([file, scale])
Export the painting as a PNG file.

`file` is the default filename to save to. Default: `"painting.png"`.

`scale` is a Number that describes what scale to resize the saved canvas (`0.5`
will be half the original, `2` would be twice as large). Default: `1`.

### painter.undo()
Undo the last action since the last tool was applied.

