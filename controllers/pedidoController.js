// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const pedidoService = require('../services/pedidoService');

// Registro de nuevo pedido //
const pedidoAlta = (req, res) => respuestas.ok200(res, 'Pedido Registrado', pedidoService.registroPedido(req.headers.user_id));
// Agrega un producto al detalle de un pedido //
const agregarProducto = (req, res) => respuestas.ok200(res, 'Detalle actualizado', pedidoService.addProducto(req.body));
// Anula mediante una baja logica un Pedido //
const pedidoBaja = (req, res) => respuestas.ok200(res, 'Pedido anulado', pedidoService.delPedido(req.headers.pedido_id));
// Lista todos los pedidos registrados (solo a los Usuarios administradores) //
const listarPedidos = (req, res) => respuestas.ok200(res, 'Pedidos registrados: ', pedidoService.getPedidos());
// Quita un producto de detalle de un pedido // 
const quitarProducto = (req, res) => respuestas.ok200(res, 'Producto eliminado y detalle actualizado: ', pedidoService.delProducto(req.body));
// Lista el historial de Pedidos de un Usuario //
const listarPedidosDeUsuario = (req, res) => respuestas.ok200(res, 'Historial de Pedidos:', {'data': pedidoService.getPedidosDeUsuario(req.headers.user_id)});
// Cambia el estado de un pedido 'NUEVO' (pendiente) a 'CONFIRMADO' //
const confirmarPedido = (req, res) => respuestas.ok200(res, 'Pedido confirmado:', {'data': pedidoService.cambiarEstado(parseInt(req.headers.pedido_id), 'CONFIRMADO')});
// Cambia el estado de un pedido que se encuentre confirmado por el Usuario (Solo para los usuario administradores) //
const cambiarEstadoPedido = (req, res) => respuestas.ok200(res, 'Estado actualizado:', {'data': pedidoService.cambiarEstado(parseInt(req.body.pedidoId), req.body.estado)});
// Cambia la direccion de un Pedido //
const cambiarDireccionEntrega = (req, res) => respuestas.ok200(res, 'Direccion actualizada:', {'data': pedidoService.putDireccion(parseInt(req.body.pedidoId), req.body.direccion)});

module.exports = { pedidoAlta, agregarProducto, pedidoBaja, listarPedidos, quitarProducto, listarPedidosDeUsuario, confirmarPedido, cambiarEstadoPedido, cambiarDireccionEntrega }