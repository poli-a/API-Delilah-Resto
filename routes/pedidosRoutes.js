const express = require('express');
const router = express.Router();
// Middlewares //
const validacionesUser = require('../middlewares/usuarioMiddleware');
const validacionesProducto = require('../middlewares/productoMiddleware');
const validacionesPedido = require('../middlewares/pedidoMiddleware');
// Controlador //
const pedidoCtrl = require('../controllers/pedidoController');

// Validaciones //
const validacionesDetalle = [validacionesUser.validarSesion, validacionesPedido.validarCamposDetalle, validacionesUser.decodificarId,
    validacionesPedido.validarPedidoExistente, validacionesUser.decodificarUsuario, validacionesPedido.validarPedidoDeUsuario,
    validacionesPedido.validarEstadoPedido, validacionesProducto.validarProductoExistente, validacionesProducto.validarProductoActivo];
const validacionesDelete = [validacionesUser.validarSesion, validacionesPedido.validarPedidoExistente, validacionesPedido.validarEstadoPedido, validacionesUser.decodificarUsuario, validacionesPedido.validarPedidoDeUsuario];
const validacionDelDetalle = [validacionesUser.validarSesion, validacionesPedido.validarPedidoExistente, validacionesUser.decodificarUsuario, validacionesPedido.validarPedidoDeUsuario,
    validacionesPedido.validarEstadoPedido, validacionesProducto.validarProductoExistente, validacionesProducto.validarProductoActivo,
    validacionesPedido.validarProductoEnDetalle, validacionesPedido.validarCantidadProductoEnDetalle];
const validacionesConfirmarPedido = [validacionesUser.validarSesion, validacionesPedido.validarPedidoExistente, validacionesUser.decodificarUsuario, validacionesPedido.validarPedidoDeUsuario,
    validacionesPedido.validarPedidoNuevo, validacionesPedido.validarProductosEnPedido];
const validacionesModifEstado = [validacionesUser.validarSesion, validacionesUser.decodificarUsuario, validacionesUser.validarAdmin, validacionesPedido.validarPedidoExistente,
    validacionesPedido.validarPedidoConfirmado, validacionesPedido.validarEstadoEnReq];
// RUTAS //
// Registro de nuevo pedido //
router.post('', [validacionesUser.validarSesion, validacionesUser.decodificarId], pedidoCtrl.pedidoAlta);
// Agregar producto al detalle del pedido //
router.put('/agregar-producto', validacionesDetalle, pedidoCtrl.agregarProducto);
// Baja logica de un Pedido //
router.delete('', validacionesDelete, pedidoCtrl.pedidoBaja);
// Lista de pedidos registrados (solo admin) //
router.get('', [validacionesUser.validarSesion, validacionesUser.decodificarUsuario, validacionesUser.validarAdmin], pedidoCtrl.listarPedidos);
// Eliminar producto del detalle del pedido // (crear midd p/ validar campos oblig)
router.put('/quitar-producto', validacionDelDetalle , pedidoCtrl.quitarProducto);
// Lista de pedidos registrados por un Usuario //
router.get('/historial-pedidos', [validacionesUser.validarSesion, validacionesUser.decodificarId, validacionesPedido.validarPedidosDeUsuario], pedidoCtrl.listarPedidosDeUsuario);
// Confirma el Pedido de un Usuario para su preparacion //
router.put('/confirmar-pedido', validacionesConfirmarPedido, pedidoCtrl.confirmarPedido);
// Modifica el estado para un Pedido registrado (solo admin) //
router.put('/modificar-estado', validacionesModifEstado, pedidoCtrl.cambiarEstadoPedido);
// Modifica la direccion de entrega del Pedido //
router.put('/modificar-direccion', [validacionesUser.validarSesion, validacionesPedido.validarPedidoExistente, validacionesUser.decodificarUsuario, validacionesPedido.validarPedidoDeUsuario], pedidoCtrl.cambiarDireccionEntrega);

module.exports = router;