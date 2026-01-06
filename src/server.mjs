import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usa el middleware de compresión
app.use(compression());

// Sirve archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname + '/../'));

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../') });
});

// Ruta para servir terminos/index.html
app.get('/terminos', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../terminos') });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});