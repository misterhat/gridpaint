import type { GridPaint as gp } from '../../index.js';
import { cssColorValueToUint32 } from './color.js';
import { crc32 } from './crc32.js';
import { concatArrayBuffers } from './buf_helper.js';

import { deflateSync, constants } from 'node:zlib';
// .PNG....
const MAGIC = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
// ....IEND....
const IEND = new Uint8Array([0, 0, 0, 0, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);

function chunkNameToInt(str: string): number {
    return Array
        .from(str, (chr, i) => chr.charCodeAt(0) << ((3-i) * 8))
        .reduce((acc, num) => acc | num, 0) | 0;
}

const PngTypes = {
    IHDR: chunkNameToInt('IHDR'),
    PLTE: chunkNameToInt('PLTE'),
    tRNS: chunkNameToInt('tRNS'),
    IDAT: chunkNameToInt('IDAT'),
    IEND: chunkNameToInt('IEND'),
} as const;
type PngType = (typeof PngTypes)[keyof typeof PngTypes];

function encodePngChunk(type: PngType, data: ArrayBuffer): ArrayBuffer {
    const head = new ArrayBuffer(8 /* length + header name */);
    {
        const view = new DataView(head);
        view.setUint32(0, data.byteLength | 0);
        view.setUint32(4, type | 0);
    }

    // calc CRC, note that length is not a part of the CRC
    const crc = crc32(new Uint8Array(concatArrayBuffers([head.slice(4), data])));
    const crcB = new ArrayBuffer(4);
    {
        const view = new DataView(crcB);
        view.setUint32(0, crc | 0);
    }

    return concatArrayBuffers([head, data, crcB]);
}

const COLOR_PALETTE = 0x3;
const COLOR_RGBA = 0x6;
const WIDTH_OFF = 0;
const HEIGHT_OFF = 4;
const BITDEPTH_OFF = 8;
const COLORTYPE_OFF = 9;
function makeIHDR(w: number, h: number, paletteLen: number): ArrayBuffer  {
    const buf = new ArrayBuffer(13);
    const view = new DataView(buf);
    view.setUint32(WIDTH_OFF, w | 0);
    view.setUint32(HEIGHT_OFF, h | 0);
    view.setUint8(BITDEPTH_OFF, 8 | 0);
    if (paletteLen > 0xFF) {
        view.setUint8(COLORTYPE_OFF, COLOR_RGBA | 0);
    }
    else {
        view.setUint8(COLORTYPE_OFF, COLOR_PALETTE | 0);
    }
    return encodePngChunk(PngTypes.IHDR, buf);
}

function makePallete(palette: number[]): ArrayBuffer {
    const buf = new ArrayBuffer(palette.length * 3 /* 24bit color */ + 1 /* we trim this byte off */);
    {
        const view = new DataView(buf);
        let i = 0;
        for (const color of palette) {
            // we will shingle these bad boys on so we avoid 16 + 8 setters.
            view.setUint32(i, color | 0);
            i += 3; // palette colors are 24bit RGB.
        }
    }
    const buf_trunc = buf.slice(0, buf.byteLength - 1);
    const plte = encodePngChunk(PngTypes.PLTE, buf_trunc);

    const buf2 = new ArrayBuffer(palette.length);
    {
        const view = new DataView(buf2);
        let i = 0;
        for (const color of palette) {
            view.setUint8(i, color & 0xFF);
            i += 1; // transparencies are only the 8bit alpha channel
        }
    }
    const trns = encodePngChunk(PngTypes.tRNS, buf2);

    return concatArrayBuffers([plte, trns]);
}

function idx1Dto2D(x: number, y: number, width: number): number {
    return x + y * width;
}

function makeIDAT(
    palette: number[],
    image: number[][],
    cw: number, ch: number,
): ArrayBuffer {
    const w = image[0]?.length;
    const h = image?.length;
    const pixfmt_width_w_filter = w * cw + 1;
    if (w == undefined || h == undefined) {
        return deflateSync(new ArrayBuffer(0));
    }
    const thirtytwoB = palette.length > 0xFF;

    const totlen = w * h * cw * ch * (thirtytwoB ? 4 : 1) + (ch * h) /* filter bytes */;
    const buf = new ArrayBuffer(totlen);
    const view = new DataView(buf);
    // note we have to offset the offset by +1 to leave the filter bit unchanged (0 or NoFilter)
    const viewx = thirtytwoB
        ? (idx: number, val: number) => view.setUint32(idx * 4 + 1, val)
        : (idx: number, val: number) => view.setUint8(idx + 1, val);

    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            const color_idx = image[y][x];
            const color = palette[color_idx];
            const value = palette.length > 0xFF ? color : color_idx;

            const ystart = y * ch;
            const xstart = x * cw;
            const yend = ystart + ch;
            const xend = xstart + cw;
            for (let py = ystart; py < yend; ++py) {
                for (let px = xstart; px < xend; ++px) {
                    viewx(idx1Dto2D(px, py, pixfmt_width_w_filter), value | 0);
                }
            }
        }
    }
    const bufz = deflateSync(buf, {
        level: constants.Z_BEST_COMPRESSION,
    });
    return encodePngChunk(PngTypes.IDAT, bufz);
}

export function makePng(gp: gp): ArrayBuffer {
    const palette = gp.palette.slice().map(cssColorValueToUint32);
    const ihdr = new Uint8Array(makeIHDR(gp.width * gp.cellWidth, gp.height * gp.cellHeight, palette.length));
    if (palette.length > 0xFF) {
        const idat = makeIDAT(
            palette, gp.painting,
            gp.cellWidth, gp.cellHeight,
        );
        return concatArrayBuffers([MAGIC, ihdr, idat, IEND]);
    }
    else {
        const plte_trns = makePallete(palette);
        const idat = makeIDAT(
            palette, gp.painting,
            gp.cellWidth, gp.cellHeight,
        );
        return concatArrayBuffers([MAGIC, ihdr, plte_trns, idat, IEND]);
    }
}
