// Copyright (C) 2017  Anthony DeDominic
// See COPYING for License
function bucket(replace, x, y) {
    const colour = this.colour;
    x = x !== undefined ? x : this.cursor.x;
    y = y !== undefined ? y : this.cursor.y;
    replace = replace !== undefined ? replace : this.painting[y][x];
    const stack = [{ x, y }];
    while (stack.length !== 0) {
        /// can never be undefined if stack.length > 0
        const { x, y } = stack.pop();
        if (replace === colour || this.painting[y][x] !== replace) {
            continue;
        }
        this.painting[y][x] = colour;
        if ((y + 1) < this.height) {
            stack.push({ x, y: y + 1 });
        }
        if ((y - 1) > -1) {
            stack.push({ x, y: y - 1 });
        }
        if ((x + 1) < this.width) {
            stack.push({ x: x + 1, y });
        }
        if ((x - 1) > -1) {
            stack.push({ x: x - 1, y });
        }
    }
}
export { bucket };
