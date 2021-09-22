// Middleware //
const respuestas = require('../helpers/respuestas');
// Services //
const medioDePagoService = require('../services/medioDePagoService');

// Valida los campos obligatorios (pedidoId, medioPagoId) //
const valCamposObligatorios = (req, res, next) => {
    if (!req.body.pedidoId) return respuestas.error400(res, `La propiedad 'pedidoId' es obligatoria.`);
    if (!Number.isInteger(req.body.pedidoId)) return respuestas.error400(res, `La propiedad 'pedidoId' debe ser numerica.`);
    if (!req.body.medioPagoId) return respuestas.error400(res, `La propiedad 'medioPagoId' es obligatoria.`);
    if (!Number.isInteger(req.body.medioPagoId)) return respuestas.error400(res, `La propiedad 'medioPagoId' debe ser numerica.`);
    next();
}

// Valida la existencia de un Medio de Pago segun su id //
const valMedioPago = (req, res, next) => {
    let id;
    if (req.body.medioPagoId) id = req.body.medioPagoId;
    if (req.headers.mediopago_id) id = req.headers.mediopago_id;
    let medioPago = medioDePagoService.buscarMedioPago(id);
    medioPago ? next() : respuestas.error400(res, `No existe Medio de Pago registrado con el id ${ id }.`);
}

// Valida el campo 'detalle' al registrar un nuevo Medio de Pago //
const valDescripcion = (req, res, next) => {
    req.body.descripcion ? next() : respuestas.error400(res, `La propiedad 'descripcion' es obligatoria para registrar o modiicar el Medio de Pago.`);
}

// Valida el campo 'medioPagoId' ante de actualizar un Medio de Pago registrado //
const valCampoId = (req, res, next) => {
    req.body.medioPagoId ? next() : respuestas.error400(res, `La propiedad 'medioPagoId' es obligatoria para actualizar el Medio de Pago.`);
}

// Valida que el id del Medio de Pago a eliminar sea mayor a '1' (uno) //
// De esta manera el Medio de pago 'EFECTIVO' (id: 1) es de solo lectura //
const valMedioPagoATransaccionar = (req, res, next) => {
    req.headers.mediopago_id > 1 || req.body.medioPagoId > 1 ? next() : respuestas.error400(res, ' El id de Medio de Pago a eliminar/modificar debe ser mayor a 1 (uno).');
}

module.exports = { valCamposObligatorios, valMedioPago, valDescripcion, valCampoId, valMedioPagoATransaccionar }