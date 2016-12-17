function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// replace all of a certain colour with another
module.exports = function (old, replace) {
    var i, j, c;

    if (old === replace) {
        return;
    }

    if (typeof old === 'string') {
        old = this.palette.indexOf(old);
    }

    if (typeof replace === 'string') {
        replace = this.palette.indexOf(replace);
    }

    this.oldPainting = clone(this.painting);
    this.painting.length = 0;

    for (i = 0; i < this.height; i += 1) {
        this.painting.push([]);
        for (j = 0; j < this.width; j += 1) {
            c = this.oldPainting[i][j];
            this.painting[i].push(c === old ? replace : c);
        }
    }

    this.compareChanges();
    this.emit('replace');
};
