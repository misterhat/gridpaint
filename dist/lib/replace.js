// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
// replace all of a certain colour with another
function replace(old, replace) {
    if (old === replace) {
        return;
    }
    if (typeof old === 'string') {
        old = this.palette.indexOf(old);
    }
    if (typeof replace === 'string') {
        replace = this.palette.indexOf(replace);
    }
    this.oldPainting = this.painting.splice(0, this.painting.length);
    for (let i = 0; i < this.height; i += 1) {
        this.painting.push([]);
        for (let j = 0; j < this.width; j += 1) {
            const c = this.oldPainting[i][j];
            this.painting[i].push(c === old ? replace : c);
        }
    }
    this.compareChanges();
}
export { replace };
