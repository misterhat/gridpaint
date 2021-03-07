"use strict";
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = void 0;
let isBrowser = false;
exports.isBrowser = isBrowser;
if (typeof process === 'undefined') {
    exports.isBrowser = isBrowser = true;
}
else if ((process === null || process === void 0 ? void 0 : process.title) === 'browser') {
    exports.isBrowser = isBrowser = true;
}
