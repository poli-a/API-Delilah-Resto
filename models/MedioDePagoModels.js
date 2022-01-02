const { Schema } = require('mongoose');
const { mongoose } = require('../db/mongoDb');

const MedioDePago = new Schema({
    descripcion: { type: String, required: true, unique: true }
});
 
module.exports = mongoose.model('MedioDePago', MedioDePago);