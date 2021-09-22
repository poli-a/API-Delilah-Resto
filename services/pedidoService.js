const moment = require('moment'); 
const datos = require('../datos');

// Registra un nuevo pedido asignandole un id y guardando en array de pedidos realizados //
// Recibe el id del usuario que inicia el pedido y lo registra, y retorna un mensaje de 'Pedido registrado' //
// La direccion de entrega del Pedido se seteara automaticamente con la direccion del Usuario de la sesion y se podra modiicar mediante su endpoint correspondiente //
// El medio de pago asignado por default p/ un Pedido nuevo sera 'EFECTIVO' (id: 1) //
const registroPedido = (idUsuario) => {
    let usuario = datos.usuarios.find(usr => usr.id == idUsuario);
    let pedido = {};
    pedido.id = datos.pedidos.length + 1;
    pedido.estado = 'NUEVO';
    pedido.hora = moment().format('LTS');
    pedido.numero = pedido.id;
    pedido.total = 0;
    pedido.descripcion = '';
    pedido.detalle = [];
    pedido.direccion = usuario.direccion;
    pedido.medioDePago = datos.mediosDePago[0];
    pedido.usuarioId = idUsuario;
    pedido.cancelado = false;
    datos.pedidos.push(pedido);
    return pedido;
}

// Agrega productos al detalle del pedido. Recibe por parametro los id de pedido y producto y la cantidad del producto a agregar //
// Si el producto ya se encuentra en el detalle del pedido se actuliza la cantidad del mismo //
// Actualiza la descripcion y el total del pedido y retorna el pedido actualizado //
const addProducto = (detalle) => {
    let pedido = datos.pedidos.find( ped => ped.id == detalle.pedidoId );
    let productoElegido = pedido.detalle.find( prod => prod.productoId == detalle.productoId );
    if ( productoElegido ) {
        productoElegido.cantidad = productoElegido.cantidad + detalle.cantidad;
        productoElegido.subtotal = productoElegido.precio * productoElegido.cantidad;
        pedido = calcularTotalPedido(pedido);
        pedido = generarDescripcionPedido(pedido);
        return pedido;
    } else {
        let producto = datos.productos.find( prod => prod.id == detalle.productoId );
        productoElegido = {};
        productoElegido.productoId = detalle.productoId;
        productoElegido.cantidad = detalle.cantidad;
        productoElegido.descripcion = producto.descripcion;
        productoElegido.precio = producto.precio;
        productoElegido.subtotal = productoElegido.precio * productoElegido.cantidad;
        pedido.detalle.push(productoElegido);
        pedido.descripcion = `${ pedido.descripcion } - ${ productoElegido.cantidad }x ${ productoElegido.descripcion }`;
        pedido.total = pedido.total + productoElegido.subtotal;
        return pedido;
    }
}

// Realiza una baja logica anulando el pedido mediante el atributo 'cancelado' de la entidad Pedido //
// Recibe por parametro el id del Pedido a anular y retorna un mensaje de conirmacion // 
const delPedido = (idPedido) => {
    let pedido = datos.pedidos.find( ped => ped.id == idPedido );
    pedido.cancelado = true;
    return { 'message': `El pedido ${ pedido.numero } fue cancelado.` };
}

// Busca un pedido por su id, recibe un id de pedido por parametro y retorna un pedido //
const buscarPedidoId = (idPedido) => {
    return datos.pedidos.find( ped => ped.id === idPedido);
}

// Lista todos los productos registrados, funcion valida solo para Usuarios administradores //
const getPedidos = () => {
    return datos.pedidos;
}

// Elimina un producto del detalle de un pedido, recibe por parametro el id del pedido, el id del producto y la cantidad //
// Actualiza la descricion, el subtotal y el total del pedido y retorna el pedido actualizado //
const delProducto = (detalle) => {
    let pedido = datos.pedidos.find( ped => ped.id == detalle.pedidoId );
    let producto = pedido.detalle.find(prod => prod.productoId == detalle.productoId);
    if ( producto.cantidad > detalle.cantidad ) {
        producto.cantidad = producto.cantidad - detalle.cantidad;
        producto.subtotal = producto.cantidad * producto.precio;
        pedido = calcularTotalPedido(pedido);
        pedido = generarDescripcionPedido(pedido);
        return pedido;
    } else {
        let productoIdx = pedido.detalle.findIndex(prod => prod.productoId == detalle.productoId);
        console.log(productoIdx);
        pedido.detalle.splice(productoIdx, 1);
        pedido = calcularTotalPedido(pedido);
        pedido = generarDescripcionPedido(pedido);
        return pedido;
    }
}

// Recibe por parametro un pedido y retorna el mismo con su precio total actualizado //
// El calculo se realiza segun los subtotales de cada detalle //
const calcularTotalPedido = (pedido) => {
    pedido.total = 0;
    pedido.detalle.forEach( prod => {
        pedido.total = pedido.total + prod.subtotal;
    });
    return pedido;
}

// Recibe por parametro un Pedido y retorna el mismo con su descripcion actualizada //
// La descripcion se genera segun la descripcion de cada producto registrado en el detalle del Pedido //
const generarDescripcionPedido = (pedido) => {
    pedido.descripcion = '';
    pedido.detalle.forEach( prod => {
        pedido.descripcion = `${ pedido.descripcion } - ${ prod.cantidad }x ${ prod.descripcion }`;
    });
    return pedido;
}

// Busca un Producto en el detalle de un Pedido registrado //
// Recibe por parametro el id de un pedido y de un Producto y retorna el producto coincidente //
const buscarProductoEnDetalle = ( pedidoId, productoId ) => {
    let pedido = datos.pedidos.find( ped => ped.id == pedidoId);
    return pedido.detalle.find( prod => prod.productoId == productoId );
}

// Recibe por parametro el 'id' de un Usuario y retorna el historial de Pedidos registrados del mismo //
const getPedidosDeUsuario = (usuarioId) => {
    return datos.pedidos.filter( ped => ped.usuarioId == usuarioId);
}

// Cambia el estado de un pedido. Recibe por parametro el id del pedido y el estado con el cual se actualizara //
// Obs: los estados posibles deben ser: CONFIRMADO, PREPARANDO, ENVIANDO Y ENTREGADO //
const cambiarEstado = (pedidoId, estado) => {
    let pedido = buscarPedidoId(pedidoId);
    pedido.estado = estado;
    return pedido;
}

// Cambia la direccion de un Pedido, recibe por parametro el id del Pedido y la direccion a actualizar //
const putDireccion = (pedidoId, direccion) => {
    let pedido = buscarPedidoId(pedidoId);
    pedido.direccion = direccion;
    return pedido;
}

module.exports = { registroPedido, addProducto, buscarPedidoId, delPedido, getPedidos, delProducto, buscarProductoEnDetalle, getPedidosDeUsuario, cambiarEstado, putDireccion }