'use strict';

const FileSaver = require('file-saver');

const Canvas = require('./canvas');
const PImage = require('pureimage');
const { PassThrough } = require('stream');

async function convertToPng(canvas) {
    const passThroughStream = new PassThrough();
    const pngData = [];

    passThroughStream.on('data', chunk => pngData.push(chunk));
    passThroughStream.on('end', () => {});
    await PImage.encodePNGToStream(canvas, passThroughStream);
    return Buffer.concat(pngData);
}

// export the painting to file
module.exports = function (file, scale) {
    const exported = new Canvas(
        this.width * this.cellWidth,
        this.height * this.cellHeight,
    );
    const eCtx = exported.getContext('2d');

    file = file || 'painting.png';
    scale = scale || 1;

    this.drawPainting(eCtx, scale);

    if (process.title === 'browser') {
        exported.toBlob(function (blob) {
            FileSaver.saveAs(blob, file);
        });
    }
    else {
        // file in this nonbrowser context should be a write stream
        return convertToPng(eCtx.bitmap);
    }
};
