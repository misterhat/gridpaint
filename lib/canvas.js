if (process.browser) {
    module.exports = function (width, height) {
        var c = document.createElement('canvas');
        c.width = width || 300;
        c.height = height || 150;
        return c;
    };
} else {
    module.exports = require('canvas');
}
