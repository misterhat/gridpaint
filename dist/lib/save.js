"use strict";
// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const FileSaver = __importStar(require("file-saver"));
const canvas_1 = require("./canvas");
const stream_1 = require("stream");
const PImage = __importStar(require("pureimage"));
const browser_1 = require("./browser");
function convertToPng(canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        const passThroughStream = new stream_1.PassThrough();
        const pngData = [];
        passThroughStream.on('data', (chunk) => pngData.push(chunk));
        passThroughStream.once('end', function () { });
        yield PImage.encodePNGToStream(canvas, passThroughStream);
        return Buffer.concat(pngData);
    });
}
// export the painting to file
function save(file, scale = 1) {
    const exported = (0, canvas_1.Canvas)(this.width * this.cellWidth, this.height * this.cellHeight);
    const eCtx = exported.getContext('2d');
    if (eCtx === null) {
        console.error('<GridPaint>#save() -> Could not get 2d Context.');
        return Promise.reject('<GridPaint>#save() -> Could not get 2d Context.');
    }
    file = file !== null && file !== void 0 ? file : 'painting.png';
    this.drawPainting(scale, eCtx);
    if (browser_1.isBrowser) {
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
                    return Promise.reject('<GridPaint>#save() -> Blob should not be null!');
                }
            });
        }
    }
    else {
        // file in this nonbrowser context should be a write stream
        return convertToPng(eCtx.bitmap);
    }
    return Promise.resolve(null);
}
exports.save = save;
