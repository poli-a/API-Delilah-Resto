// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const productoService = require('../services/productoService');

// Registro de nuevo Producto //
const productoAlta = async (req, res) => respuestas.ok200(res, 'Producto Registrado', await productoService.registroProducto(req.body));
// Modificacion de Producto registrado //
const modificarProducto = async (req, res) => respuestas.ok200(res, 'Producto Modificado', await productoService.putProducto(req.body));
// Baja logica de Producto registrado //
const eliminarProducto = (req, res) => respuestas.ok200(res, 'Producto desactivado', productoService.delProducto(parseInt(req.headers.producto_id)));
// Lista todos los Productos registrados //
const listarProductos = (req, res) => respuestas.ok200(res, 'Productos registrados:', productoService.getProductos());

module.exports = { productoAlta, modificarProducto, eliminarProducto, listarProductos}