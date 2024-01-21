'use strict';

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
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
        extensionAlias: { '.js': ['.js', '.ts'], },
        extensions: ['.ts', '.js'],
        alias: {
            pureimage: false,
            stream: false,
        },
    },
    // devtool: 'source-map',
    output: {
        filename: 'index.bundle.js',
        path: resolve(__dirname, 'docs'),
    },
};
