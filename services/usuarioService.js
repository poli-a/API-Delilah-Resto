const datos = require('../datos'); //borrar
const Usuario = require('../models/UsuarioModels');
const jwt = require('jsonwebtoken');

// Registra un usuario asignandole un id y guardando en array de usuarios //
// Recibe un usuario por parametro y retorna un mensaje de 'Usuario registrado' //
// En el caso que el usuario este con baja logica (desactivado), se setea su atributo 'activo' en true //
const registroUsuario = async (user) => {
    //let usuario = buscarEmail(user.email);
    let usuario = await Usuario.findOne({ email: user.email });
    if (usuario) {
        //usuario.activo = true;
        await Usuario.updateOne({ _id: usuario._id }, { activo: true });
    } else {
        /*usuario = {};
        usuario.id = datos.usuarios.length + 1;
        usuario.username = user.username;
        usuario.nombreApellido = user.nombreApellido;
        usuario.email = user.email;
        usuario.password = user.password;
        usuario.activo = true;
        usuario.admin = false;
        usuario.telefono = user.telefono;
        usuario.direccion = user.direccion;
        datos.usuarios.push(usuario);*/
        let usuario = await new Usuario({
            username: user.username,
            nombreApellido: user.nombreApellido,
            email: user.email,
            password: user.password,
            activo: true,
            admin: false,
            telefono: user.telefono,
            direccion: user.direccion
        });
        usuario.save();
    }
    return 'Usuario registrado';
}

// Logueo de usuario, recibe por parametro e identifica si se encuentra registrado para iniciar sesion //
// Retorna un usuario si las credenciales son correctas //
const loginUsuario = async (user) => {    
    let usuario = Object.assign({}, await identificarUsuario(user));
    //datos.usuariosLogueados.push(usuario);
    //delete usuario.password;
    
    const token = jwt.sign(usuario._doc, process.env.JWTFIRMA);
    return token;
}

// Busca email en array de usuarios registrado //
// Recibe un email por parametro y retorna un usuario coincidente con el mismo //
const buscarEmail = async (email) => {
    //return datos.usuarios.find(usuario => usuario.email == email);
    return await Usuario.findOne({ email: email });
}

// Identifica un usuario por email y contraseña //
// Recibe como parametro un Usuario y retorna un un usuario si se cumplen las condiciones //
const identificarUsuario = async (user) => {
    /*return datos.usuarios.find(
        usuario => (usuario.username === user.identif || usuario.email === user.identif) && usuario.password === user.password
    );*/
    return await Usuario.findOne({ email: user.identif,  password: user.password });
}

// Confirma que el usuario este logueado // (DEPRECADO, BORRAR)
/*const confirmarSesion = (idUsuario) => {
    return datos.usuariosLogueados.find(user => user.id == idUsuario);
}*/

// Modifica Usuario por su id //
// Modifica uno o todos los atributos de la entidad Usuario excepto 'id', 'admin' y 'activo'//
// Recibe por parametro id de usuario a modificar y la informacion nueva //
const modificarUsuario = async (info, idUsuario) => {
    /*let usuario = datos.usuarios.find( user => user.id == datosUser._id );
    if (info.username) usuario.username = info.username;
    if (info.nombreApellido) usuario.nombreApellido = info.nombreApellido;
    if (info.email) usuario.email = info.email;
    if (info.password) usuario.password = info.password;
    if (info.telefono) usuario.telefono = info.telefono;
    if (info.direccion) usuario.direccion = info.direccion;*/
    if (info.username) await Usuario.updateOne({ _id: idUsuario }, { username: info.username });
    if (info.nombreApellido) await Usuario.updateOne({ _id: idUsuario }, { nombreApellido: info.username });
    if (info.email) await Usuario.updateOne({ _id: idUsuario }, { email: info.email });
    if (info.password) await Usuario.updateOne({ _id: idUsuario }, { password: info.password });
    if (info.telefono) await Usuario.updateOne({ _id: idUsuario }, { nombreApellido: info.telefono });
    if (info.direccion) await Usuario.updateOne({ _id: idUsuario }, { direccion: info.direccion });
    return await Usuario.findOne({ _id: idUsuario });
}

// Elimina un Usuario mediante su id //
// Se realiza una baja logica del usuario, seteando su propiedad 'activo' como false //
const eliminaUsuario = async (idUsuario) => {
    /*let usuario = datos.usuarios.find( user => user.id == idUsuario );
    usuario.activo = false;
    usuario = datos.usuariosLogueados.find( user => user.id == idUsuario );
    let idx = datos.usuariosLogueados.findIndex(user => user == usuario);
    datos.usuariosLogueados.splice(idx, 1);
    return 'Usuario desactivado.';*/
    await Usuario.updateOne({ _id: idUsuario }, { activo: false });
    return 'Usuario desactivado.';
}

// Retorna todos los usuario registrados //
// Obs: solo para Usuario con rol administrado ('admin': true) //
const getUsuarios = async () => {
    return await Usuario.find();
}

// Busca y retorna un Usuario por id pasado por parametro // (DEPRECADO, BORRAR)
/*const buscarUsuarioId = (idUsuario) => {
    return datos.usuarios.find(usr => usr.id == idUsuario);
}*/

module.exports = { registroUsuario, loginUsuario, identificarUsuario, buscarEmail,
    /*confirmarSesion,*/ modificarUsuario, eliminaUsuario, /*buscarUsuarioId,*/ getUsuarios }