// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const productoService = require('../services/productoService');

// Registro de nuevo Producto //
const productoAlta = async (req, res) => respuestas.ok200(res, 'Producto Registrado', await productoService.registroProducto(req.body));
// Modificacion de Producto registrado //
const modificarProducto = async (req, res) => respuestas.ok200(res, 'Producto Modificado', await productoService.putProducto(req.body));
// Baja logica de Producto registrado //
const eliminarProducto = async (req, res) => respuestas.ok200(res, 'Producto desactivado', await productoService.delProducto(req.headers.producto_id));
// Lista todos los Productos registrados //
const listarProductos = async (req, res) => respuestas.ok200(res, 'Productos registrados:', await productoService.getProductos());

module.exports = { productoAlta, modificarProducto, eliminarProducto, listarProductos}