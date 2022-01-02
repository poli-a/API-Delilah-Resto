const moment = require('moment');
const Usuario = require('../models/UsuarioModels');
const Pedido = require('../models/PedidoModels');
const Producto = require('../models/ProductoModels');
const MedioDePago = require('../models/MedioDePagoModels');
const respuesta = require('../helpers/respuestas')

const datos = require('../datos');

// Registra un nuevo pedido //
// Recibe el id del usuario que inicia el pedido y lo registra, y retorna un mensaje de 'Pedido registrado' //
// La direccion de entrega del Pedido se seteara automaticamente con la direccion del Usuario de la sesion y se podra modiicar mediante su endpoint correspondiente //
// El medio de pago asignado por default p/ un Pedido nuevo sera 'EFECTIVO' //
const registroPedido = async (idUsuario) => {
    //let usuario = datos.usuarios.find(usr => usr.id == idUsuario);
    let usuario = await Usuario.findById( idUsuario );
    let medioDePago = MedioDePago.findOne({ descripcion: 'EFECTIVO' });
    /*let pedido = {};
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
    return pedido;*/
    let pedido = await new Pedido({
        estado: 'PENDIENTE',
        hora: moment().format('LTS'),
        numero: Math.random(),
        total: 0,
        descripcion: '',
        detalle: [],
        direccion: usuario.direccion,
        medioDePago: medioDePago._id,
        usuarioId: idUsuario,
        cancelado: false
    });
    pedido.save();
    return pedido;
}

// Agrega productos al detalle del pedido. Recibe por parametro los id de pedido y producto y la cantidad del producto a agregar //
// Si el producto ya se encuentra en el detalle del pedido se actuliza la cantidad del mismo //
// Actualiza la descripcion y el total del pedido y retorna el pedido actualizado //
const addProducto = async (detalle) => {
    try {
        // let pedido = datos.pedidos.find( ped => ped.id == detalle.pedidoId );
        let pedido = await Pedido.findById(detalle.pedidoId);
        
        let productoElegido = pedido.detalle.find( prod => prod.productoId == detalle.productoId );
        // console.log(productoElegido); //
        if ( productoElegido ) {
            productoElegido.cantidad = productoElegido.cantidad + detalle.cantidad;
            productoElegido.subtotal = productoElegido.precio * productoElegido.cantidad;
            await Pedido.findOneAndUpdate({"_id": detalle.pedidoId, "detalle.productoId": productoElegido.productoId},
            {"$set": {"detalle.$": productoElegido }});

            pedido = await Pedido.findById(detalle.pedidoId);

            let total = 0;
            let descripcion = "";
            pedido.detalle.forEach(item => {
                total = total + item.subtotal;
                descripcion = descripcion + item.cantidad + "X - " + item.descripcion + ", ";
            });

            await Pedido.findOneAndUpdate({"_id": detalle.pedidoId}, {"$set": {"total": total, "descripcion": descripcion}});
            /*pedido.total = calcularTotalPedido(pedido);
            pedido.descripcion = generarDescripcionPedido(pedido);
            // Se crea nuevo detalle con datos actualizados //
            let nuevoDetalle = pedido.detalle.create({
                productoId: detalle.productoId,
                cantidad: productoElegido.cantidad,
                descripcion: productoElegido.descripcion,
                precio: productoElegido.precio,
                subtotal: productoElegido.subtotal
            });
            // Se elimina el detalle anterior y se agrega el nuevo detalle actualizado //
            pedido.detalle.id(productoElegido._id).remove();        
            pedido.detalle.push(nuevoDetalle);
            await pedido.save();
        
            //return pedido;*/
        } else {

            // let producto = datos.productos.find( prod => prod.id == detalle.productoId );
            let productoElegido = await Producto.findById(detalle.productoId);
            let nuevoDetalle = {
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                descripcion: productoElegido.descripcion,
                precio: productoElegido.precio,
                subtotal: productoElegido.precio * detalle.cantidad
            };

            
            pedido.detalle.push(nuevoDetalle);
            await pedido.save();
            /*productoElegido = {};
            productoElegido.productoId = detalle.productoId;
            productoElegido.cantidad = detalle.cantidad;
            productoElegido.descripcion = producto.descripcion;
            productoElegido.precio = producto.precio;
            productoElegido.subtotal = productoElegido.precio * productoElegido.cantidad;
            pedido.detalle.push(productoElegido);*/
            pedido = await Pedido.findById(detalle.pedidoId);
            let total = 0;
            let descripcion = "";
            pedido.detalle.forEach(item => {
                total = total + item.subtotal;
                descripcion = descripcion + item.cantidad + "X - " + item.descripcion + ", ";
            });
            await Pedido.findOneAndUpdate({"_id": detalle.pedidoId}, {"$set": {"total": total, "descripcion": descripcion}});

            //return pedido;
        }
        return await Pedido.findById(detalle.pedidoId);
    } catch (err) {
        console.log(err);
    }
    
}

// Realiza una baja logica anulando el pedido mediante el atributo 'cancelado' de la entidad Pedido //
// Recibe por parametro el id del Pedido a anular y retorna un mensaje de conirmacion // 
const delPedido = async (idPedido) => {
    /*let pedido = datos.pedidos.find( ped => ped.id == idPedido );
    pedido.cancelado = true;
    return { 'message': `El pedido ${ pedido.numero } fue cancelado.` };*/

    await Pedido.findByIdAndUpdate(idPedido, { cancelado: true });
    let pedido = await Pedido.findById(idPedido);
    return { 'message': `El pedido ${ pedido.numero } fue cancelado.` };
}

// Busca un pedido por su id, recibe un id de pedido por parametro y retorna un pedido //
const buscarPedidoId = async (idPedido) => {
    // return datos.pedidos.find( ped => ped.id === idPedido);
    return await Pedido.findById(idPedido);
}

// Lista todos los productos registrados, funcion valida solo para Usuarios administradores //
const getPedidos = async () => {
    //return datos.pedidos;
    return await Pedido.find();
}

// Elimina un producto del detalle de un pedido, recibe por parametro el id del pedido, el id del producto y la cantidad //
// Actualiza la descricion, el subtotal y el total del pedido y retorna el pedido actualizado //
const delProducto = async (detalle) => {
    /*let pedido = datos.pedidos.find( ped => ped.id == detalle.pedidoId );
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
    }*/
    let pedido = await Pedido.findById(detalle.pedidoId);
    let producto = pedido.detalle.find(prod => prod.productoId == detalle.productoId);
    if ( producto.cantidad > detalle.cantidad) {
        producto.cantidad = producto.cantidad - detalle.cantidad;
        producto.subtotal = producto.cantidad * producto.precio;

        await Pedido.findOneAndUpdate({"_id": detalle.pedidoId, "detalle.productoId": producto.productoId},
            {"$set": {"detalle.$": producto }});

        pedido = await Pedido.findById(detalle.pedidoId);

        let total = 0;
        let descripcion = "";
        pedido.detalle.forEach(item => {
            total = total + item.subtotal;
            descripcion = descripcion + item.cantidad + "X - " + item.descripcion + ", ";
        });

        await Pedido.findOneAndUpdate({"_id": detalle.pedidoId}, {"$set": {"total": total, "descripcion": descripcion}});

    } else {
        await Pedido.findOneAndUpdate({"_id": detalle.pedidoId }, { "$pull": {"detalle": { "productoId": detalle.productoId }}});

        pedido = await Pedido.findById(detalle.pedidoId);

        let total = 0;
        let descripcion = "";
        pedido.detalle.forEach(item => {
            total = total + item.subtotal;
            descripcion = descripcion + item.cantidad + "X - " + item.descripcion + ", ";
        });

        await Pedido.findOneAndUpdate({"_id": detalle.pedidoId}, {"$set": {"total": total, "descripcion": descripcion}});
    }
    return await Pedido.findById(detalle.pedidoId);
}

// Busca un Producto en el detalle de un Pedido registrado //
// Recibe por parametro el id de un pedido y de un Producto y retorna el producto coincidente //
const buscarProductoEnDetalle = async ( pedidoId, productoId ) => {
    /*let pedido = datos.pedidos.find( ped => ped.id == pedidoId);
    return pedido.detalle.find( prod => prod.productoId == productoId );*/
    let pedido = await Pedido.findById(pedidoId);
    return pedido.detalle.find( prod => prod.productoId == productoId );
}

// Recibe por parametro el 'id' de un Usuario y retorna el historial de Pedidos registrados del mismo //
const getPedidosDeUsuario = async (usuarioId) => {
    // return datos.pedidos.filter( ped => ped.usuarioId == usuarioId);
    return await Pedido.find( { "usuarioId" : usuarioId });
}

// Cambia el estado de un pedido. Recibe por parametro el id del pedido y el estado con el cual se actualizara //
// Obs: los estados posibles deben ser: CONFIRMADO, PREPARANDO, ENVIANDO Y ENTREGADO //
const cambiarEstado = async (pedidoId, estado) => {
    // let pedido = await buscarPedidoId(pedidoId);
    //pedido.estado = estado;
    await Pedido.findOneAndUpdate({"_id": pedidoId}, {"$set": {"estado": estado }});
    return await buscarPedidoId(pedidoId);
}

// Cambia la direccion de un Pedido, recibe por parametro el id del Pedido y la direccion a actualizar //
const putDireccion = async (pedidoId, direccion) => {
    /*let pedido = buscarPedidoId(pedidoId);
    pedido.direccion = direccion;
    return pedido;*/
    await Pedido.findOneAndUpdate({"_id": pedidoId}, {"$set": {"direccion": direccion }});
    return await buscarPedidoId(pedidoId);
}

module.exports = { registroPedido, addProducto, buscarPedidoId, delPedido, getPedidos, delProducto, buscarProductoEnDetalle, getPedidosDeUsuario, cambiarEstado, putDireccion }