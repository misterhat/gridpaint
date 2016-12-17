// empty all of the grid units
module.exports = function () {
    var i, j;

    // allow the user to undo a clear
    if (Array.isArray(this.painting) && Array.isArray(this.painting[0])) {
        this.oldPainting = clone(this.painting);
    }

    this.painting.length = 0;

    for (i = 0; i < this.height; i += 1) {
        this.painting.push([]);
        for (j = 0; j < this.width; j += 1) {
            this.painting[i].push(0);
        }
    }

    this.compareChanges();
    this.emit('clear');
};
