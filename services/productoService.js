const datos = require('../datos');
const clienteRedis = require('../db/redisCon');
const Producto = require('../models/ProductoModels');

//Busca un producto por su id pasado por parametro y retorna un Producto //
const buscarProductoId = async (idProducto) => {
    // return datos.productos.find(producto => producto.id === idProducto);
    return await Producto.findById(idProducto);
}

// Registra un nuevo  //
const registroProducto = async (datosProducto) => {
    /*let producto = {};
    producto.id = datos.productos.length + 1;
    producto.descripcion = datosProducto.descripcion;
    producto.precio = datosProducto.precio;
    producto.is_active = datosProducto.is_active;
    datos.productos.push(producto);
    return producto;*/
    let producto = await new Producto({
        descripcion: datosProducto.descripcion,
        precio: datosProducto.precio,
        is_active: datos.is_active
    });
    producto.save();
    // medioPago.id = idxAnterior + 1;
    // medioPago.descripcion = descripcion;
    return producto;
}

// Modifica un Producto por su id. Recibe por parametro el id del Producto registrado y los datos a actualizar //
const putProducto = async (datosProducto) => {
    /*let producto = datos.productos.find(prod => prod.id === datosProducto.productoId);
    if (datosProducto.descripcion) producto.descripcion = datosProducto.descripcion;
    if (datosProducto.precio) producto.precio = datosProducto.precio;
    if (datosProducto.is_active != undefined) producto.is_active = datosProducto.is_active;
    return producto;*/
    let datos = {};
    if (datosProducto.descripcion) datos.descripcion = datosProducto.descripcion;
    if (datosProducto.precio) datos.precio = datosProducto.precio;
    if (datosProducto.is_active != undefined) datos.is_active = datosProducto.is_active;
    await Producto.findOneAndUpdate({"_id": datosProducto.productoId}, datos);
    return await Producto.findById(datosProducto.productoId);
}

const delProducto = async (productoId) => {
    /*let producto = buscarProductoId(productoId);
    producto.is_active = false;
    return producto;*/
    await Producto.findOneAndUpdate({ "_id": productoId }, { "is_active": false });
    return await Producto.findById(productoId);
}

// Retorna array de todos los Productos registrados //
const getProductos = async () => {
    let productos = await Producto.find();
    clienteRedis.set("productos", JSON.stringify(productos), 'EX', 10*60*60, (error) => {
        if (error) return error;
    });
    return productos;
};

module.exports = { buscarProductoId, registroProducto, putProducto, delProducto, getProductos }