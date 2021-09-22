const express = require('express');
const router = express.Router();

// Controlador //
const productoCtrl = require('../controllers/productoController');
// Middlewares //
const validacionesProducto = require('../middlewares/productoMiddleware');
const validacionesUser = require('../middlewares/usuarioMiddleware');
// Validaciones //
const validacionesModif = [ validacionesUser.validarAdmin, validacionesProducto.validarProductoExistente, validacionesProducto.valCampoBool, validacionesProducto.validarCampoPrecio]
// RUTAS //
// Registro de nuevo pedido //
router.post('',  [validacionesUser.validarAdmin, validacionesProducto.valCamposNuevoProducto], productoCtrl.productoAlta);
//  Edita un Producto registrado //
router.put('', validacionesModif, productoCtrl.modificarProducto);
// Baja logica de un Producto registrado //
router.delete('',  [validacionesUser.validarAdmin, validacionesProducto.validarProductoExistente], productoCtrl.eliminarProducto);
// Lista todos los Productos registrados //
router.get('', productoCtrl.listarProductos);

module.exports = router;