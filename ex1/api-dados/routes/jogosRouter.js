const express = require('express');
const router = express.Router();
const jogosController = require('../controllers/jogosController');

router.get('/autores', jogosController.getAutores);
router.get('/categorias', jogosController.getCategorias);
router.get('/jogos/:id', jogosController.getById);
router.get('/jogos', jogosController.list);
router.post('/', jogosController.insert);
router.put('/jogos/:id', jogosController.update);
router.delete('/jogos/:id', jogosController.delete);

module.exports = router;
