const express = require('express');
const router = express.Router();
const livrosController = require('../controllers/livrosController');

router.get('/livros', livrosController.list);
router.post('/livros', livrosController.insert);
router.put('/livros/:id', livrosController.update);
router.delete('/livros/:id', livrosController.delete);

module.exports = router;
