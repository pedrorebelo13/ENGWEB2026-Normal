const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 19021;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir ficheiros estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname)));

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback para SPA (Single Page Application) - qualquer rota desconhecida serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handler de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err.message);
    res.status(500).json({ error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Interface a correr em http://localhost:${PORT}`);
    console.log(`Ligado à API em http://localhost:19020`);
});

module.exports = app;
