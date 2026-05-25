var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

const mongoURI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/jogostabuleiro';
mongoose.connect(mongoURI)
  .then(() => console.log(`Conectado ao MongoDB em: ${mongoURI}`))
  .catch((err) => console.error('Erro ao ligar ao MongoDB:', err));

var jogosRouter = require('./routes/jogosRouter');
var Jogo = require('./models/jogosModel');

// Seed da BD — só insere se a coleção estiver vazia
async function seedDB() {
    try {
        const count = await Jogo.countDocuments();
        if (count === 0) {
            const dados = require('./dados/jogos.json');
            await Jogo.insertMany(dados);
            console.log(`✓ Seed concluído: ${dados.length} jogos inseridos.`);
        } else {
            console.log(`✓ BD já tem ${count} jogos, seed ignorado.`);
        }
    } catch (error) {
        console.error('Erro ao fazer seed:', error);
    }
}

var app = express();

// CORS habilitado para comunicação entre containers
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', jogosRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const PORT = process.env.PORT || 17000;
app.listen(PORT, '0.0.0.0', async () => { 
    await seedDB();
    console.log(`API a correr na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs/`);
});

module.exports = app;
