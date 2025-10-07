// src/compress.mjs
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export async function compressText(text) {
    try {
        const buffer = await gzipAsync(text);
        return buffer.toString('base64');
    } catch (err) {
        throw new Error('Error al comprimir: ' + err.message);
    }
}

export async function decompressText(compressedText) {
    try {
        const buffer = Buffer.from(compressedText, 'base64');
        const decompressedBuffer = await gunzipAsync(buffer);
        return decompressedBuffer.toString();
    } catch (err) {
        throw new Error('Error al descomprimir: ' + err.message);
    }
}