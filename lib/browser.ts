// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License

let isBrowser = false;
if (typeof process === 'undefined') {
    isBrowser = true;
}
else if (globalThis.process?.title === 'browser') {
    isBrowser = true;
}

export { isBrowser };
