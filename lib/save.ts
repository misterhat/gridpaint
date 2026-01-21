// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
import type { GridPaint as gp } from '../index.js';

import { Canvas } from './canvas.js';
import { isBrowser } from './browser.js';

let makePng: (gp: gp) => ArrayBuffer;
if (!isBrowser) {
    makePng = (await import('./node/png.js')).makePng;
}

/**
 * `a.click()` doesn't work for all browsers (#465)
 *
 * From file-saver npm package, vendored and inlined for simplicity's sake.
 * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
 *
 * @see https://github.com/eligrey/FileSaver.js
 */
function click(node: HTMLElement) {
    try {
        node.dispatchEvent(new MouseEvent('click'));
    }
    catch {
        const evt = document.createEvent('MouseEvents');
        evt.initMouseEvent(
            'click', true, true, window, 0, 0, 0, 80,
            20, false, false, false, false, 0, null,
        );
        node.dispatchEvent(evt);
    }
}

/**
 * Simple tool to generate a download event in a browser.
 *
 * Based on file-saver npm package code, vendored and inlined for simplicity's sake.
 * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
 *
 * @see https://github.com/eligrey/FileSaver.js
 */
function saveAs(blob: Blob, name: string) {
    const URL = globalThis.URL || globalThis.webkitURL;
    // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue #561)
    const a = (document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement);

    a.download = name;
    a.rel = 'noopener'; // tabnabbing

    // Support blobs
    a.href = URL.createObjectURL(blob);
    setTimeout(function () {
        URL.revokeObjectURL(a.href);
    }, 4E4); // 40s
    setTimeout(function () {
        click(a);
    }, 0);
}

/**
 * Export the painting to file.
 *
 * @param [file='painting.png'] The file name.
 * @param [scale=1]             How big to make the image.
 */
function save(this: gp, file = 'painting.png', scale = 1): Promise<null|Blob> | ArrayBuffer {
    if (!isBrowser) return makePng(this);

    const exported: HTMLCanvasElement = Canvas(
        this.width * this.cellWidth,
        this.height * this.cellHeight,
    );
    const eCtx = exported.getContext('2d');
    if (eCtx === null) {
        console.error('<GridPaint>#save() -> Could not get 2d Context.');
        return Promise.reject(
            '<GridPaint>#save() -> Could not get 2d Context.',
        );
    }
    this.drawPainting(scale, eCtx);

    if (file === ':blob:') {
        return new Promise(resolve => {
            exported.toBlob(blob => {
                resolve(blob);
            }, 'image/png');
        });
    }
    else {
        exported.toBlob(blob => {
            if (blob !== null) {
                saveAs(blob, file);
            }
            else {
                console.error('<GridPaint>#save() -> Blob should not be null!');
                return Promise.reject(
                    '<GridPaint>#save() -> Blob should not be null!',
                );
            }
        }, 'image/png');
    }
    return Promise.resolve(null);
}

export { save };
