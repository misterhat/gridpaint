"use strict";
// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
const pureimage_1 = require("pureimage");
const browser_1 = require("./browser");
let Canvas;
exports.Canvas = Canvas;
if (browser_1.isBrowser) {
    exports.Canvas = Canvas = function (width, height) {
        const c = document.createElement('canvas');
        c.width = width || 300;
        c.height = height || 150;
        return c;
    };
}
else {
    exports.Canvas = Canvas = function (width, height) {
        return pureimage_1.PImage.make(width || 300, height || 150);
    };
}
