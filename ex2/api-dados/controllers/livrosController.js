const Livro = require('../models/livrosModel');

const livrosController = {
    // GET /livros - lista de todos os livros
    list: async function(req, res) {
        try {
            if (req.query.search) {
                const livros = await Livro.find({
                    $or: [
                        { titulo: { $regex: req.query.search, $options: 'i' } },
                        { autor: { $regex: req.query.search, $options: 'i' } }
                    ]
                });
                res.json(livros);
            } else {
                const livros = await Livro.find();
                res.json(livros);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /livros - criar novo livro
    insert: async function(req, res) {
        try {
            const newLivro = new Livro(req.body);
            await newLivro.save();
            res.status(201).json(newLivro);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // PUT /livros/:id - atualizar livro
    update: async function(req, res) {
        try {
            const updatedLivro = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedLivro) {
                res.status(404).json({ error: "Livro não encontrado" });
            } else {
                res.json(updatedLivro);
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    // DELETE /livros/:id - deletar livro
    delete: async function(req, res) {
        try {
            const deletedLivro = await Livro.findByIdAndDelete(req.params.id);
            if (!deletedLivro) {
                res.status(404).json({ error: "Livro não encontrado" });
            } else {
                res.json({ message: "Livro apagado com sucesso" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
}

module.exports = livrosController;