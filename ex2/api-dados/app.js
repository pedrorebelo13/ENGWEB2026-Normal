var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');

const cors = require('cors');

const mongoURI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/livrosDB';

// Ligação com retry — necessário porque o MongoDB pode demorar a arrancar no Docker
async function connectWithRetry(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(mongoURI);
            console.log(`Conectado ao MongoDB em: ${mongoURI}`);
            return;
        } catch (err) {
            console.error(`Tentativa ${i + 1}/${retries} falhou: ${err.message}`);
            if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
        }
    }
    console.error('Não foi possível ligar ao MongoDB. A terminar.');
    process.exit(1);
}

// Seed da BD — só insere se a coleção estiver vazia
async function seedDB() {
    const Livro = require('./models/livrosModel');
    const count = await Livro.countDocuments();
    if (count === 0) {
        const dados = require('./dados/livros.json');
        await Livro.insertMany(dados);
        console.log(`Seed concluído: ${dados.length} livros inseridos.`);
    } else {
        console.log(`BD já tem ${count} livros, seed ignorado.`);
    }
}

connectWithRetry().then(seedDB);

var livrosRouter = require('./routes/livrosRouter');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', livrosRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({ error: err.message });
});

const PORT = process.env.PORT || 19020;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API a correr na porta ${PORT}`);
});

module.exports = app;
