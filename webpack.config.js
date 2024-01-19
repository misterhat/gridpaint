'use strict';

const path = require('path');

// Node.js 17+ broke MD4 style hashes, which breaks Webpack 5
const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
// gotta love monkey patching
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm);

module.exports = {
    mode: 'production',
    entry: './examples/browser.js',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            pureimage: false,
            stream: false,
        },
    },
    output: {
        filename: 'index.bundle.js',
        path: path.resolve(__dirname, 'docs'),
    },
};
