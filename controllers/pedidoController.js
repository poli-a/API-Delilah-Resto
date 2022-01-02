// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const pedidoService = require('../services/pedidoService');

// Registro de nuevo pedido //
const pedidoAlta = async (req, res) => respuestas.ok200(res, 'Pedido Registrado', await pedidoService.registroPedido(req.headers.user_id));
// Agrega un producto al detalle de un pedido //
const agregarProducto = async (req, res) => respuestas.ok200(res, 'Detalle actualizado', await pedidoService.addProducto(req.body));
// Anula mediante una baja logica un Pedido //
const pedidoBaja = async (req, res) => respuestas.ok200(res, 'Pedido anulado', await pedidoService.delPedido(req.headers.pedido_id));
// Lista todos los pedidos registrados (solo a los Usuarios administradores) //
const listarPedidos = async (req, res) => respuestas.ok200(res, 'Pedidos registrados: ', await pedidoService.getPedidos());
// Quita un producto de detalle de un pedido // 
const quitarProducto = async (req, res) => respuestas.ok200(res, 'Producto eliminado y detalle actualizado: ', await pedidoService.delProducto(req.body));
// Lista el historial de Pedidos de un Usuario //
const listarPedidosDeUsuario = async (req, res) => respuestas.ok200(res, 'Historial de Pedidos:', {'data': await pedidoService.getPedidosDeUsuario(req.headers.user_id)});
// Cambia el estado de un pedido 'NUEVO' (pendiente) a 'CONFIRMADO' //
const confirmarPedido = async (req, res) => respuestas.ok200(res, 'Pedido confirmado:', {'data': await pedidoService.cambiarEstado(req.headers.pedido_id, 'CONFIRMADO')});
// Cambia el estado de un pedido que se encuentre confirmado por el Usuario (Solo para los usuario administradores) //
const cambiarEstadoPedido = async (req, res) => respuestas.ok200(res, 'Estado actualizado:', {'data': await pedidoService.cambiarEstado(req.body.pedidoId, req.body.estado)});
// Cambia la direccion de un Pedido //
const cambiarDireccionEntrega =  async (req, res) => respuestas.ok200(res, 'Direccion actualizada:', {'data': await pedidoService.putDireccion(req.body.pedidoId, req.body.direccion)});

module.exports = { pedidoAlta, agregarProducto, pedidoBaja, listarPedidos, quitarProducto, listarPedidosDeUsuario, confirmarPedido, cambiarEstadoPedido, cambiarDireccionEntrega }