// Usuario administrador para prueba //
const userAdmin = {
    id: 1,
    username: 'root',
    nombreApellido: 'Usuario Administrador',
    email: 'root@mail.com',
    password: '123456', 
    admin: true,
    activo: true
}
// Array de usuario registrados (solo un admin) //
const usuarios = [userAdmin];
// Aray de usuarios logueados //
const usuariosLogueados = [];
// Array de pedidos registrados //
const pedidos = [];
// Array de productos //
const productos = [{
    id: 1,
    descripcion: 'Hamburguesa Clasica',
    precio: 350,
    is_active: true
},{
    id: 2,
    descripcion: 'Sandwich Veggie',
    precio: 310,
    is_active: true
},{
    id: 3,
    descripcion: 'Veggie Avocado',
    precio: 310,
    is_active: true
},{
    id: 4,
    descripcion: 'Focaccia bla',
    precio: 280,
    is_active: true
},{
    id: 5,
    descripcion: 'Bagel de Salmon',
    precio: 425,
    is_active: false
},{
    id: 6,
    descripcion: 'Ensalada Veggie',
    precio: 340,
    is_active: true
},{
    id: 7,
    descripcion: 'Sandwich Focaccia',
    precio: 440,
    is_active: true
}];

const mediosDePago = [{
    id: 1,
    descripcion: 'EFECTIVO'
},{
    id: 2,
    descripcion: 'DEBITO VISA'
},{
    id: 3,
    descripcion: 'CREDITO VISA'
},{
    id: 4,
    descripcion: 'CREDITO MASTER'
},{
    id: 5,
    descripcion: 'CREDITO NARANJA'
}]

module.exports = { usuarios, usuariosLogueados, pedidos, productos, mediosDePago }