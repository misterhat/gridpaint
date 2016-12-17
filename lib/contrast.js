// set a contrasting grid colour
module.exports = function () {
    var cw, ch, data, darkCells, i, j, offset, r, g, b, y;

    if (!this.grid) {
        return;
    }

    cw = this.cellWidth;
    ch = this.cellHeight;
    data = this.ctx.getImageData(0, 0, this.canvas.width,
                                 this.canvas.height).data;
    darkCells = 0;

    for (i = 0; i < this.width * cw; i += cw - 1) {
        for (j = 0; j < this.height * ch; j += ch - 1) {
            offset = (j * this.canvas.width + i) * 4;
            r = data[offset];
            g = data[offset + 1];
            b = data[offset + 2];
            y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            darkCells += y < 128;
        }
    }

    if (darkCells > (this.width * this.height) / 2) {
        this.gridColour = '#fff';
    } else {
        this.gridColour = '#000';
    }
};
