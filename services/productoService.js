const datos = require('../datos');
const clienteRedis = require('../db/redisCon');

//Busca un producto por su id pasado por parametro y retorna un Producto //
const buscarProductoId = (idProducto) => {
    return datos.productos.find(producto => producto.id === idProducto);
}

// Registra un nuevo producto asignandole un id y guardando en array de Productos //
const registroProducto = (datosProducto) => {
    let producto = {};
    producto.id = datos.productos.length + 1;
    producto.descripcion = datosProducto.descripcion;
    producto.precio = datosProducto.precio;
    producto.is_active = datosProducto.is_active;
    datos.productos.push(producto);
    return producto;
}

// Modifica un Producto por su id. Recibe por parametro el id del Producto registrado y los datos a actualizar //
const putProducto = (datosProducto) => {
    let producto = datos.productos.find(prod => prod.id === datosProducto.productoId);
    if (datosProducto.descripcion) producto.descripcion = datosProducto.descripcion;
    if (datosProducto.precio) producto.precio = datosProducto.precio;
    if (datosProducto.is_active != undefined) producto.is_active = datosProducto.is_active;
    return producto;
}

const delProducto = (productoId) => {
    let producto = buscarProductoId(productoId);
    producto.is_active = false;
    return producto;
}

// Retorna array de todos los Productos registrados //
const getProductos = () => {
    clienteRedis.set("productos", JSON.stringify(datos.productos), 'EX', 10*60*60, (error) => {
        if (error) return error;
    });
    return datos.productos;
};

module.exports = { buscarProductoId, registroProducto, putProducto, delProducto, getProductos }