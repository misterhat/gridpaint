// Copyright (C) 2016  Zorian Medwin
// Copyright (C) 2021  Anthony DeDominic
// See COPYING for License
/** Draw the checkered pattern to indicate transparency. */
function background() {
    let odd = false;
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    for (let i = 0; i < this.width * 2; i += 1) {
        for (let j = 0; j < this.height * 2; j += 1) {
            this.ctx.fillStyle = odd ? '#999999' : '#666666';
            this.ctx.fillRect(i * (cw / 2), j * (ch / 2), cw / 2, ch / 2);
            odd = !odd;
        }
        odd = !odd;
    }
}
/**
 * Overlap the current colour as a crosshair over the position it will be
 * applied to.
 * If this.previous_point is defined, this draws a Line of cursors to current
 * cursor point.
 */
function cursor() {
    if (this.cursor.x < 0 || this.cursor.y < 0) {
        return;
    }
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    for (const { x, y } of this.line_approx(this.cursor.x, this.cursor.y)) {
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = this.palette[this.colour];
        this.ctx.fillRect(x * cw + cw / 4, y * ch, cw / 2, ch);
        this.ctx.fillRect(x * cw, y * ch + ch / 4, cw, ch / 2);
        this.ctx.globalAlpha = 1;
    }
}
/** Draw contrasting grid units. */
function grid() {
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    this.ctx.strokeStyle = this.gridColour;
    for (let i = 0; i < this.width; i += 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * cw + 0.5, 0);
        this.ctx.lineTo(i * cw + 0.5, ch * this.height);
        this.ctx.stroke();
    }
    for (let i = 0; i < this.height; i += 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, i * ch + 0.5);
        this.ctx.lineTo(cw * this.width, i * ch + 0.5);
        this.ctx.stroke();
    }
}
/**
 * Draw the grid units onto a canvas.
 *
 * @param scale size scaling, probably useless
 * @param ctx   the canvas context to draw on.
 */
function painting(scale = 1, ctx) {
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    const local_ctx = ctx ?? this.ctx;
    for (let i = 0; i < this.height; i += 1) {
        for (let j = 0; j < this.width; j += 1) {
            local_ctx.fillStyle =
                this.palette[this.painting[i][j]] ?? 'rgba(0,0,0,0)';
            local_ctx.fillRect(j * cw * scale, i * ch * scale, cw * scale, ch * scale);
        }
    }
}
/** Draw loop. */
function tick() {
    if (this.background) {
        this.drawBackground();
    }
    else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.drawPainting();
    this.drawCursor();
    if (this.grid) {
        this.drawGrid();
    }
    if (this.drawing) {
        window.requestAnimationFrame(this.boundDraw);
    }
}
export { background, cursor, grid, painting, tick };
