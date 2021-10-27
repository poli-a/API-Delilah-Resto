const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoDb');
 
const Usuario = new Schema({
    username: { type: String, required: true},
    nombreApellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    admin: { type: Boolean, required: true },
    activo: { type: Boolean, required: true },
    telefono: { type: Number, required: true },
    direccion: { type: String, required: true }
});
 
module.exports = mongoose.model('Usuario', Usuario);