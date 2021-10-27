const express = require('express');
const router = express.Router();
// Controlador //
const userCtrl = require('../controllers/usuarioController');
// Middleware //
const validacionesUser = require('../middlewares/usuarioMiddleware');
// Validaciones //
const validacionesRegistro = [validacionesUser.validarCamposObligatorios, validacionesUser.validarEmailUnico];
const validacionesLogin = [validacionesUser.validarCamposObligatoriosLogin, validacionesUser.autenticarUsuario];
const validacionesModif = [validacionesUser.validarSesion, validacionesUser.validarEmailUnico, validacionesUser.validarTel, validacionesUser.decodificarId];

// RUTAS //
// Registro de usuario //
router.post('/registro', validacionesRegistro, userCtrl.usuarioAlta);
// Login de usuario //
router.post('/login', validacionesLogin, userCtrl.usuarioLogin);
// Modifica Usuario //
router.put('', validacionesModif, userCtrl.modificarUsuario);
// Elimina Usuario //
router.delete('', [validacionesUser.validarSesion, validacionesUser.decodificarId], userCtrl.eliminarUsuario);
// Lista de usuarios registrados (solo admin) //
router.get('', [validacionesUser.validarSesion, validacionesUser.decodificarUsuario, validacionesUser.validarAdmin], userCtrl.listarUsuarios);

module.exports = router;