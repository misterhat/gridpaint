// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

import * as PImage from 'pureimage';
import { isBrowser } from './browser.js';

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
        // Cooerce the pureimage return to HTMLCanvasElement, in non-browser contexts
        // the actual HTML Canvas components are unused or will error anyhow.
        return (PImage.make(
            width || 300,
            height || 150,
        ) as any);
    };
}

export { Canvas };
