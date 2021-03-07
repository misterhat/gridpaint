// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import { PImage } from 'pureimage';
import { isBrowser } from './browser';

let Canvas: (w: number, h: number) => HTMLCanvasElement;

if (isBrowser) {
    Canvas = function (width: number, height: number): HTMLCanvasElement {
        const c = document.createElement('canvas');
        c.width = width || 300;
        c.height = height || 150;
        return c;
    };
}
else {
    Canvas = function (width: number, height: number): HTMLCanvasElement {
        return PImage.make(
            width || 300,
            height || 150,
        );
    };
}

export { Canvas };
