// Service //
const userService = require('../services/usuarioService');
// Helper //
const respuestas = require('../helpers/respuestas');

// Registro de usuario //
const usuarioAlta = (req, res) => respuestas.created201(res, userService.registroUsuario(req.body));
// Login de usuario //
const usuarioLogin = (req, res) => {
    respuestas.ok200(res, 'Usuario logueado.', userService.loginUsuario(req.body));
}
// Modificacion de Usuario //
const modificarUsuario = (req, res) => 
    respuestas.ok200(res, 'Datos actualizados.', userService.modificarUsuario(req.body, req.headers.user_id));
// Eliminacion (desactivar) Usuario //
const eliminarUsuario = (req, res) => respuestas.ok200(res, userService.eliminaUsuario(req.headers.user_id), {});
// Lista todos los usuarios registrados (solo admin) //
const listarUsuarios = (req, res) => respuestas.ok200(res, 'Usuarios registrados:', {'data': userService.getUsuarios()});

module.exports = { usuarioAlta, usuarioLogin, modificarUsuario, eliminarUsuario, listarUsuarios }