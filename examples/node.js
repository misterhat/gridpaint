var GridPaint = require('../');

var painter = new GridPaint({ width: 10, height: 10, cellWidth: 16 }),
    strokes = [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { colour: 4, x: 1, y: 2 },
        { x: 5, y: 1 },
        { x: 5, y: 2 },
        { x: 6, y: 1 },
        { colour: 4, x: 6, y: 2 },
        { colour: 4, x: 2, y: 5 },
        { colour: 4, x: 3, y: 5 },
        { colour: 4, x: 4, y: 5 },
        { colour: 4, x: 5, y: 5 },
        { colour: 13, x: 2, y: 6 }
    ];

painter.tool = 'pencil';

strokes.forEach(function (a) {
    painter.colour = a.colour || 1;
    painter.cursor.x = a.x;
    painter.cursor.y = a.y;
    painter.action();
});

painter.saveAs('node.png');
