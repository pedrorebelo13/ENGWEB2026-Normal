const mongoose = require('mongoose');

const jogosSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    minPlayers: { type: Number, required: true },
    maxPlayers: { type: Number, required: true },
    playingTimeMinutes: { type: Number, required: true },
    descriptionEN: { type: String, required: true },
    autores: [{
        _id: { type: String, required: true },
        name: { type: String, required: true }
    }],
    editoras: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        country: { type: String, required: true }
    }],
    mecanicas: [{
        _id: { type: String, required: true },
        name: { type: String, required: true }
    }],
    premios: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        year: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('jogos', jogosSchema);