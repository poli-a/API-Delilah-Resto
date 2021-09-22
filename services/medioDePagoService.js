const datos = require('../datos');

// Lista todos los medios registrados //
const getMediosDePago = () => {
    return datos.mediosDePago;
}

// Modifica el Medio de Pago para un Pedido realizado por un Usuario //
const setMedioDePago = (datosPago) => {
    let pedido = datos.pedidos.find(ped => ped.id == datosPago.pedidoId);
    let medioPago = datos.mediosDePago.find(mp => mp.id == datosPago.medioPagoId);
    pedido.medioDePago = medioPago;
    return pedido;
}

// Busca un Medio de Pago segun su id //
const buscarMedioPago = (idMedioPago) => {
    let medioPago = datos.mediosDePago.find(mp => mp.id == idMedioPago);
    return medioPago;
}

// Registra un nuevo Medio de Pago //
const postMedioDePago = (descripcion) => {
    let idxAnterior = datos.mediosDePago.length;
    let medioPago = {};
    medioPago.id = idxAnterior + 1;
    medioPago.descripcion = descripcion;
    return medioPago;
}

// Modifica un Medio de Pago registrado //
const putMedioPago = (datosMDP) => {
    let medioDePago = buscarMedioPago(datosMDP.medioPagoId);
    medioDePago.descripcion = datosMDP.descripcion;
    return medioDePago;
}

const delMedioDePago = (idMP) => {
    let medioPago = buscarMedioPago(idMP);
    let idx = datos.mediosDePago.indexOf(medioPago);
    datos.mediosDePago.splice(idx, 1);
    return `El Medio de Pago con el id '${idMP}' fue eliminado con exito.`
}

module.exports = { getMediosDePago, setMedioDePago, buscarMedioPago, postMedioDePago, putMedioPago, delMedioDePago }