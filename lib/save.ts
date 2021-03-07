// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License



import type { GridPaint as gp } from '../index';

import * as FileSaver from 'file-saver';
import { Canvas } from './canvas';
import { PassThrough } from 'stream';
import * as PImage from 'pureimage';
import { isBrowser } from './browser';

async function convertToPng(canvas: any): Promise<Buffer> {
    const passThroughStream = new PassThrough();
    const pngData: Buffer[] = [];

    passThroughStream.on('data', (chunk: Buffer) => pngData.push(chunk));
    passThroughStream.once('end', function() {});
    await PImage.encodePNGToStream(canvas, passThroughStream);
    return Buffer.concat(pngData);
}

// export the painting to file
function save(this: gp, file?: string, scale = 1):
Promise<null|Blob|Buffer> | undefined {
    const exported: HTMLCanvasElement = Canvas(
        this.width * this.cellWidth,
        this.height * this.cellHeight,
    );
    const eCtx = exported.getContext('2d');
    if (eCtx === null) {
        console.error('<GridPaint>#save() -> Could not get 2d Context.');
        return;
    }

    file = file ?? 'painting.png';

    this.drawPainting(scale, eCtx);

    if (isBrowser) {
        if (file === ':blob:') {
            return new Promise((resolve) => {
                exported.toBlob(blob => {
                    resolve(blob);
                }, 'image/png');
            });
        }
        else {
            exported.toBlob(blob => {
                if (blob !== null) {
                    FileSaver.saveAs(blob, file);
                }
                else {
                    console.error('<GridPaint>#save() -> Blob should not be null!');
                }
            });
        }
    }
    else {
        // file in this nonbrowser context should be a write stream
        return convertToPng((eCtx as any).bitmap);
    }
}

export { save };
