// Middleware //
const respuestas = require('../helpers/respuestas');
// Services //
const pedidoService = require('../services/pedidoService');

// Valida campos obligatorios para agregar detalle al pedido //
const validarCamposDetalle = (req, res, next) =>{
    if (!req.body.pedidoId) return respuestas.error400(res, `La propiedad 'pedidoId' es obligatoria.`);
    // if (!Number.isInteger(req.body.pedidoId)) return respuestas.error400(res, `La propiedad 'pedidoId' debe ser numerica.`);
    if (!req.body.productoId) return respuestas.error400(res, `La propiedad 'productoId' es obligatoria.`);
    // if (!Number.isInteger(req.body.productoId)) return respuestas.error400(res, `La propiedad 'productoId' debe ser numerica.`);
    if (!req.body.cantidad) return respuestas.error400(res, `La propiedad 'cantidad' es obligatoria.`);
    if (!Number.isInteger(req.body.cantidad)) return respuestas.error400(res, `La propiedad 'cantidad' debe ser numerica.`);
    next();
}

// Valida que el pedido exista segun id enviado en request (por headers o por body)//
const validarPedidoExistente = async (req, res, next) => {
    let id = req.headers.pedido_id;
    if (req.body.pedidoId) id = req.body.pedidoId;
    
    try {
        let pedido = await pedidoService.buscarPedidoId(id);
        pedido ? next() : respuestas.error400(res, `No existe pedido registrado con el id ${ id }.`);
    } catch (err) {
        respuestas.error400(res, `No existe pedido registrado con el id ${ id }.`);
    }
}

// Valida que el pedido posea el estado 'PENDIENTE' y no se encuantre cancelado ('cancelado': true)//
const validarEstadoPedido = async (req, res, next) => {
    let pedidoId;
    if (req.body.pedidoId) pedidoId = req.body.pedidoId;
    if (req.headers.pedido_id) pedidoId = req.headers.pedido_id;
    let pedido = await pedidoService.buscarPedidoId(pedidoId);
    if (pedido.estado !== 'PENDIENTE') 
        return respuestas.error400(res, `El pedido con el id ${ pedidoId }, ya fue confirmado y no se puede modificar.`);
    if (pedido.cancelado)
        return respuestas.error400(res, `El pedido con el id ${ pedidoId }, fue cancelado y no se puede modificar.`);
    next();
}

// Valida que un Producto se encuentre en el detalle de un Pedido //
const validarProductoEnDetalle = async (req, res, next) => {
    let producto = await pedidoService.buscarProductoEnDetalle(req.body.pedidoId, req.body.productoId);
    producto ? next() : respuestas.error400(res, `El pedido con el id ${ req.body.pedidoId } no registra producto con id ${ req.body.productoId }.`);
}

// Valida que la cantidad de un Producto a eliminar no sea mayor a la registrada en el detalle del Pedido //
const validarCantidadProductoEnDetalle = async (req, res, next) => {
    let producto = await pedidoService.buscarProductoEnDetalle(req.body.pedidoId, req.body.productoId);
    if ( producto.cantidad < req.body.cantidad )
        return respuestas.error400(res, `La cantidad para el producto que desea eliminar es mayor a la registrada en el Pedido. Cantidad registrada: ${ producto.cantidad } - Producto id: ${ producto.productoId }`);
    if ( req.body.cantidad <= 0 )
        return respuestas.error400(res, `La cantidad del producto a eliminar debe ser mayor a 0 (cero).`);
    next();
}

// Valida que el Usuario de la sesion posea Pedidos registrados //
const validarPedidosDeUsuario = async (req, res, next) => {
    let pedidos = await pedidoService.getPedidosDeUsuario(req.headers.user_id);
    pedidos.length !== 0 ? next() : respuestas.error400(res, `El Usuario no posee Pedidos registrados.`);
}

// Valida que un Pedido registrado corresponda al Usuario de la sesion //
const validarPedidoDeUsuario = async (req, res, next) => {
    let pedidoId = req.headers.pedido_id;
    if(req.body.pedidoId) pedidoId = req.body.pedidoId;
    let pedido = await pedidoService.buscarPedidoId(pedidoId);
    pedido.usuarioId == req.headers.user._id ? next() : respuestas.error400(res, `El Pedido que se desea modificar no corresponde al Usuario de la sesion.`);
}

// Valida que el Pedido posea estado 'NUEVO' //
const validarPedidoNuevo = async (req, res, next) => {
    let pedido = await pedidoService.buscarPedidoId(req.headers.pedido_id);
    pedido.estado == 'PENDIENTE' ? next() : respuestas.error400(res, `El Pedido que se desea modificar ya fue 'CONFIRMADO' o 'CANCELADO'.`);
}

// Valida que el Pedido contenga Producto/s asociado/s en detalle //
const validarProductosEnPedido = async (req, res, next) => {
    let pedido = await pedidoService.buscarPedidoId(req.headers.pedido_id);
    pedido.detalle.length !== 0 ? next() : respuestas.error400(res, `El Pedido no se puede confirmar porque no posee Productos asociados en su detalle.`);
}

// Valida que el Pedido este confirmado //
const validarPedidoConfirmado = async (req, res, next) => {
    let pedido = await pedidoService.buscarPedidoId(req.body.pedidoId);
    pedido.estado !== 'PENDIENTE' ? next() : respuestas.error400(res, `El Pedido no se puede modificar porque aun no fue confirmado por el Usuario que lo genero.`);
}

// Valida que el estado enviado sea correcto (Estados posibles: CONFIRMADO, PREPARANDO, ENVIANDO y ENTREGADO) //
const validarEstadoEnReq = (req, res, next) => {
    req.body.estado == 'CONFIRMADO' || req.body.estado == 'PREPARANDO' || req.body.estado == 'ENVIANDO' || req.body.estado == 'ENTREGADO' ? 
    next() : respuestas.error400(res, `El 'estado' enviado no es valido. Por favor, indique uno de los siguientes estados (respetando mayusculas): CONFIRMADO, PREPARANDO, ENVIANDO y ENTREGADO`);
}

module.exports = { validarPedidoExistente, validarEstadoPedido, validarCamposDetalle, validarProductoEnDetalle, validarCantidadProductoEnDetalle, validarPedidosDeUsuario,
    validarPedidoDeUsuario, validarPedidoNuevo, validarProductosEnPedido, validarPedidoConfirmado, validarEstadoEnReq }