"use strict";
// Copyright (C) 2017  Anthony DeDominic
// See COPYING for License
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
function bucket(replace, x, y) {
    const colour = this.colour;
    x = x !== undefined ? x : this.cursor.x;
    y = y !== undefined ? y : this.cursor.y;
    replace = replace !== undefined ? replace : this.painting[y][x];
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
}
exports.bucket = bucket;
