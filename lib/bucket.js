// fill in surrounding, like-coloured grid units
module.exports = function (replace, x, y) {
    var colour = this.colour;

    x = typeof x !== 'undefined' ? x : this.cursor.x;
    y = typeof y !== 'undefined' ? y : this.cursor.y;
    replace = typeof replace !== 'undefined' ? replace : this.painting[y][x];

    if (replace === colour || this.painting[y][x] !== replace) {
        return;
    }

    this.painting[y][x] = colour;

    if ((y + 1) < this.height) {
        this.bucket(replace, x, y + 1);
    }

    if ((y - 1) > -1) {
        this.bucket(replace, x, y - 1);
    }

    if ((x + 1) < this.width) {
        this.bucket(replace, x + 1, y);
    }

    if ((x - 1) > -1) {
        this.bucket(replace, x - 1, y);
    }
};
