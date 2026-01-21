export function concatArrayBuffers(bufs: ArrayBuffer[]): ArrayBuffer {
    const totalLen = bufs.reduce((len, buf) => len + buf.byteLength, 0);
    const newBuffer = new ArrayBuffer(totalLen);
    const view = new Uint8Array(newBuffer);

    let off = 0;
    bufs.forEach(buf => {
        view.set(new Uint8Array(buf), off);
        off += buf.byteLength;
    });

    return newBuffer;
}
