const respuestas = require('../helpers/respuestas');
const usuarioService = require('../services/usuarioService');
const jwt = require('jsonwebtoken');

// Valida que el email para registro sea unico //
const validarEmailUnico = async (req, res, next) => {
    let usuario = await usuarioService.buscarEmail(req.body.email);
    if ( usuario ) {
        usuario.activo ? respuestas.error400(res, 'El email ya se encuentra registrado.') : next();
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
    if (!req.body.identif) return respuestas.error400(res, 'El email es requerido.');
    if (!req.body.password) return respuestas.error400(res, 'La contraseña es requerida.');
    next();
}

// Autentica usuario mediante email y contraseña // 
// Solo se loguearan los usuarios activos // 
const autenticarUsuario = async (req, res, next) => {
    let usuario = await usuarioService.identificarUsuario(req.body);
    usuario && usuario.activo ? next() : respuestas.error400(res, 'Credenciales incorrectas. Usuario no registrado o desactivado.');
}

// Obtiene id del usuario de token y lo setea en headers //
const decodificarId = (req, res, next) => {
    let decoded = decodificarToken(req.headers.authorization);
    req.headers.user_id = decoded._id;
    next();
}

// Obtiene datos de Usuario de token y lo setea en headers //
const decodificarUsuario = (req, res, next) => {
    let decoded = decodificarToken(req.headers.authorization);
    req.headers.user = decoded;
    next();
}

// Decodifica el token para obtener datos del usuario //
const decodificarToken = (authorization) => {
    token = authorization;
    jwtToken = token.split(" ")[1];
    return jwt.verify(jwtToken, process.env.JWTFIRMA);
}

// Conirma sesion de usuario decodificando token //
const validarSesion = (req, res, next) => {
    /*let user = usuarioService.confirmarSesion(req.headers.user_id);
    user ? next() : respuestas.error400(res, 'Debe iniciar sesion para realizar esta accion.');*/
    try {
        decodificarToken(req.headers.authorization);
        next();
    } catch (error) {
        respuestas.error404(res, 'Debe iniciar sesion para realizar esta accion.');
    }
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
    req.headers.user.admin ? next() : respuestas.error400(res, 'Solo los usuario administradores pueden realizar esta accion.');
}

module.exports = { validarEmailUnico, validarCamposObligatorios, autenticarUsuario,
    validarCamposObligatoriosLogin, validarSesion, validarTel, validarAdmin, decodificarId, decodificarUsuario }