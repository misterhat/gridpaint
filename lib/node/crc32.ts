const CRC32_TABLE = Array.from({ length: 256 }, (_, n) => {
    let crc = n;
    for (let i = 0; i < 8; ++i) {
        crc = ((crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1));
    }
    return crc;
});

export function crc32(chunk: Uint8Array): number {
    const crc = chunk.reduce((crc, byte) => {
        return (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff];
    }, -1);
    return (crc ^ (-1)) >>> 0;
}
