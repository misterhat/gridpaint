'use strict';

const path = require('path');

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
