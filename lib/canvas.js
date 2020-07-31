'use strict';

const PImage = require('pureimage');

if (process.browser) {
    module.exports = function (width, height) {
        const c = document.createElement('canvas');
        c.width = width || 300;
        c.height = height || 150;
        return c;
    };
}
else {
    module.exports = function (width, height) {
        return PImage.make(
            width || 300,
            height || 150,
        );
    };
}
