const express = require('express');
const router = express.Router();

// Controlador //
const mediosDePagoCtrl = require('../controllers/medioDePagoController');
// Midlewares //
const valMediosDePago = require('../middlewares/medioDePagoMiddleware');
const valPedido = require('../middlewares/pedidoMiddleware');
const valUser = require('../middlewares/usuarioMiddleware');

// Validaciones //
const valPutMP = [valMediosDePago.valCamposObligatorios, valPedido.validarPedidoExistente, valPedido.validarPedidoDeUsuario, valMediosDePago.valMedioPago];
const valActualizar = [valUser.validarAdmin, valMediosDePago.valMedioPagoATransaccionar, valMediosDePago.valCampoId, valMediosDePago.valMedioPago, valMediosDePago.valDescripcion];
// Lista de Medios de Pago registrados //
router.get('/', mediosDePagoCtrl.listarMediosDePago);
// Modifica el Medio de Pago de un Pedido registrado por un Usuario //
router.put('/cambiar', valPutMP, mediosDePagoCtrl.modifMedioDePago);
// Registra un nuevo medio de pago (solo admin) //
router.post('/', [valUser.validarAdmin, valMediosDePago.valDescripcion], mediosDePagoCtrl.altaMedioDePago);
// Edita un Medio de Pago registrado (solo admin) //
router.put('/', valActualizar, mediosDePagoCtrl.actualizarMedioPago);
// Elimina un Medio de Pago registrado (solo admin)//
router.delete('/', [valUser.validarAdmin, valMediosDePago.valMedioPagoATransaccionar, valMediosDePago.valMedioPago], mediosDePagoCtrl.eliminarMedioDePago);

module.exports = router;