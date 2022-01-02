const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoDb');
 
const Detalle = new Schema({
    productoId: { type: Schema.Types.ObjectId, required: true },
    cantidad: { type: Number, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true }, 
    subtotal: { type: Number, required: true }
});
const Pedido = new Schema({
    estado: { type: String, required: true},
    hora: { type: String, required: true },
    numero: { type: Number, required: true, unique: true },
    total: { type: Number, required: true, default: 0 },
    descripcion: { type: String },
    detalle: [Detalle],
    direccion: { type: String, required: true },
    medioDePagoId: { type: Schema.Types.ObjectId, ref: 'medioDePago' },
    usuarioId: { type: Schema.Types.ObjectId, ref: 'usuario' },
    cancelado: { type: Boolean, default: false }
});
 
module.exports = mongoose.model('Pedido', Pedido);