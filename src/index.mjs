// src/index.mjs
import { readFile } from 'fs/promises';
import { compressText, decompressText } from './compress.mjs';

async function main() {
    try {
        // Lee el contenido de index.html desde la raíz del proyecto
        const htmlContent = await readFile(new URL('../index.html', import.meta.url), 'utf-8');
        
        // Comprime el contenido
        const compressed = await compressText(htmlContent);
        console.log('Contenido comprimido:', compressed);

        // Descomprime el contenido
        const decompressed = await decompressText(compressed);
        console.log('Contenido descomprimido:', decompressed);
    } catch (err) {
        console.error(err);
    }
}

main();