const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoDb');
 
const Producto = new Schema({
    descripcion: { type: String, required: true},
    precio: { type: Number, required: true },
    is_active: { type: Boolean, required: true, default: true }
});
 
module.exports = mongoose.model('Producto', Producto);