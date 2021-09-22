const respuestas = require('../helpers/respuestas');
const usuarioService = require('../services/usuarioService')

// Valida que el email para registro sea unico //
const validarEmailUnico = (req, res, next) => {
    let usuario = usuarioService.buscarEmail(req.body.email);
    if ( usuario && usuario.activo ) {
        respuestas.error400(res, 'El email ya se encuentra registrado.')
    } else {
        next();
    }
}

// Valida campos obligatorios enviados en body para registro de usuario //
const validarCamposObligatorios = (req, res, next) => {
    if (!req.body.username) return respuestas.error400(res, 'El nombre de usuario es obligatorio.');
    if (!req.body.nombreApellido) return respuestas.error400(res, 'El nombre y apellido es obligatorio.');
    if (!req.body.email) return respuestas.error400(res, 'El email es obligatorio.');
    if (!req.body.password) return respuestas.error400(res, 'La contraseña es obligatoria.');
    if (!req.body.telefono) return respuestas.error400(res, 'El telefono es obligatorio.');
    if (!req.body.direccion) return respuestas.error400(res, 'La direccion es obligatoria.');
    next();
}

// Valida campos obligatorios enviados en body para login de usuario //
const validarCamposObligatoriosLogin = (req, res, next) => {
    if (!req.body.identif) return respuestas.error400(res, 'El nombre de usuario o email es requerido.');
    if (!req.body.password) return respuestas.error400(res, 'La contraseña es requerida.');
    next();
}

// Autentica usuario mediante nombre de usuario o email y contraseña //
// Solo se loguearan los usuarios activos //
const autenticarUsuario = (req, res, next) => {
    let usuario = usuarioService.identificarUsuario(req.body);
    if (usuario && usuario.activo) {
        res.header({'user_id': usuario.id});
        next();
    } else {
        respuestas.error400(res, 'Credenciales incorrectas. Usuario no registrado o desactivado.');
    }
}

// Conirma sesion de usuario recibiendo id del mismo por header //
const validarSesion = (req, res, next) => {
    let user = usuarioService.confirmarSesion(req.headers.user_id);
    user ? next() : respuestas.error400(res, 'Debe iniciar sesion para realizar esta accion.');
}

// Valida que el telefono de un Usuario sea de tipo numerico //
const validarTel = (req, res, next) => {
    if (req.body.telefono) {
        Number.isInteger(req.body.telefono) ? next() : respuestas.error400(res, 'El telefono debe ser de tipo numerico.');
    } else {
        next();
    }
}    

// Valida que el Usuario tenga el rol de administrador //
const validarAdmin = (req, res, next) => {
    let usuario = usuarioService.buscarUsuarioId(parseInt(req.headers.user_id));
    usuario.admin ? next() : respuestas.error400(res, 'Solo los usuario administradores pueden realizar esta accion.');
}

module.exports = { validarEmailUnico, validarCamposObligatorios, autenticarUsuario,
    validarCamposObligatoriosLogin, validarSesion, validarTel, validarAdmin }