const Jogo = require('../models/jogosModel');

const jogosController = {
    // GET /jogos - lista com campos: id, name, year, category, minPlayers
    list: async function(req, res) {
        try {
            const filter = {};
            
            // Se tem filtro por editora
            if (req.query.editora) {
                filter['editoras.name'] = req.query.editora;
            }

            let query = Jogo.find(filter);

            if (req.query.editora) {
                // Com filtro: retorna id, name, year
                query = query.select('_id name year');
            } else {
                // Sem filtro: retorna id, name, year, category, minPlayers
                query = query.select('_id name year category minPlayers');
            }

            const jogos = await query;
            res.json(jogos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // GET /jogos/:id - toda a informação
    getById: async function(req, res) {
        try {
            const jogo = await Jogo.findById(req.params.id);
            if (!jogo) {
                res.status(404).json({ error: "Jogo não encontrado" });
            } else {
                res.json(jogo);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /jogos - criar novo jogo
    insert: async function(req, res) {
        try {
            const newJogo = new Jogo(req.body);
            await newJogo.save();
            res.status(201).json(newJogo);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // PUT /jogos/:id - atualizar jogo
    update: async function(req, res) {
        try {
            const updatedJogo = await Jogo.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedJogo) {
                res.status(404).json({ error: "Jogo não encontrado" });
            } else {
                res.json(updatedJogo);
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    // DELETE /jogos/:id - deletar jogo
    delete: async function(req, res) {
        try {
            const deletedJogo = await Jogo.findByIdAndDelete(req.params.id);
            if (!deletedJogo) {
                res.status(404).json({ error: "Jogo não encontrado" });
            } else {
                res.json({ message: "Jogo apagado com sucesso" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /autores - lista de autores com seus jogos
    getAutores: async function(req, res) {
        try {
            const jogos = await Jogo.find();
            const autoresMap = {};

            // Agrupar autores e seus jogos
            jogos.forEach(jogo => {
                if (jogo.autores && Array.isArray(jogo.autores)) {
                    jogo.autores.forEach(autor => {
                        if (!autoresMap[autor.name]) {
                            autoresMap[autor.name] = [];
                        }
                        autoresMap[autor.name].push({
                            id: jogo._id,
                            nome: jogo.name
                        });
                    });
                }
            });

            // Converter para array e ordenar por nome
            const autores = Object.keys(autoresMap)
                .sort()
                .map(nome => ({
                    nome: nome,
                    jogos: autoresMap[nome]
                }));

            res.json(autores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /categorias - lista de categorias com seus jogos
    getCategorias: async function(req, res) {
        try {
            const jogos = await Jogo.find();
            const categoriasMap = {};

            // Agrupar categorias e seus jogos
            jogos.forEach(jogo => {
                const cat = jogo.category;
                if (!categoriasMap[cat]) {
                    categoriasMap[cat] = [];
                }
                categoriasMap[cat].push({
                    id: jogo._id,
                    nome: jogo.name
                });
            });

            // Converter para array e ordenar por nome
            const categorias = Object.keys(categoriasMap)
                .sort()
                .map(cat => ({
                    categoria: cat,
                    jogos: categoriasMap[cat]
                }));

            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = jogosController;