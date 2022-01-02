// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const medioDePagoService = require('../services/medioDePagoService');

// Lista todos los Medios de Pago registrados //
const listarMediosDePago = (req, res) => respuestas.ok200(res, 'Medios de Pago disponibles: ', medioDePagoService.getMediosDePago());
// Modifica el Medio de Pago p/ un Pedido iniciado por un Usuario //
const modifMedioDePago = (req, res) => respuestas.ok200(res, 'Medio de pago modificado: ', medioDePagoService.setMedioDePago(req.body));
// Registra un nuevo Medio de Pago //
const altaMedioDePago = async (req, res) => respuestas.ok200(res, 'Medio de pago registrado: ', await medioDePagoService.postMedioDePago(req.body.descripcion));
// Modifica un Medio de Pago registrado //
const actualizarMedioPago = (req, res) => respuestas.ok200(res, 'Medio de Pago actualizado:', medioDePagoService.putMedioPago(req.body));
// Elimina un Medio de Pago registrado //
const eliminarMedioDePago = (req, res) => respuestas.ok200(res, 'Medio de Pago eliminado con exito', medioDePagoService.delMedioDePago(req.headers.mediopago_id));

module.exports = { listarMediosDePago, modifMedioDePago, altaMedioDePago, actualizarMedioPago, eliminarMedioDePago }