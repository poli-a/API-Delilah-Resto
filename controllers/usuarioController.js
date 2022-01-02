// Service //
const userService = require('../services/usuarioService');
// Helper //
const respuestas = require('../helpers/respuestas');

// Registro de usuario //
const usuarioAlta = async (req, res) => respuestas.created201(res, await userService.registroUsuario(req.body));
// Login de usuario //
const usuarioLogin = async (req, res) => {
    respuestas.ok200(res, 'Usuario logueado.', await userService.loginUsuario(req.body));
}
// Modificacion de Usuario //
const modificarUsuario = async (req, res) => 
    respuestas.ok200(res, 'Datos actualizados.', await userService.modificarUsuario(req.body, req.headers.user_id));
// Eliminacion (desactivar) Usuario //
const eliminarUsuario = async (req, res) => respuestas.ok200(res, await userService.eliminaUsuario(req.headers.user_id), {});
// Lista todos los usuarios registrados (solo admin) //
const listarUsuarios = async (req, res) => respuestas.ok200(res, 'Usuarios registrados:', {'data': await userService.getUsuarios()});

module.exports = { usuarioAlta, usuarioLogin, modificarUsuario, eliminarUsuario, listarUsuarios }