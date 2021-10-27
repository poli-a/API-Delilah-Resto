// Middleware //
const respuestas = require('../helpers/respuestas');
// Service //
const productoService = require('../services/productoService');
// Cliente Redis //
const clienteRedis = require('../db/redisCon');

// Valida que un producto este activo por su id, retorna el Producto si se cumple la condicion //
const validarProductoExistente = (req, res, next) => {
    let productoId;
    if (req.headers.producto_id) productoId = req.headers.producto_id;
    if (req.body.productoId) productoId = req.body.productoId;
    let prod = productoService.buscarProductoId(parseInt(productoId));
    prod ? next() : respuestas.error400(res, `No existe producto registrado con el id ${ productoId }.`);
}

// Valida que el producto este disponible mediante la propiedad 'is_active' //
const validarProductoActivo = (req, res, next) => {
    let prod = productoService.buscarProductoId(req.body.productoId);
    prod.is_active ? next() : respuestas.error400(res, `El producto con el id ${ req.body.productoId } no se encuentra disponible`);
}

// Valida campos p/ registrar un nuevo producto //
const valCamposNuevoProducto = (req, res, next) => {
    if (!req.body.descripcion) return respuestas.error400(res, `La propiedad 'descripcion' es obligatoria.`);
    if (!req.body.precio) return respuestas.error400(res, `La propiedad 'precio' es obligatoria.`);
    if (typeof(req.body.precio) != 'number') return respuestas.error400(res, `La propiedad 'precio' debe ser numerica.`);
    if (req.body.precio < 1) return respuestas.error400(res, `La propiedad 'precio' debe ser mayor a 0 (cero).`);
    if (typeof req.body.is_active != 'boolean')
        return respuestas.error400(res, `La propiedad 'is_active' debe ser de tipo Booleano.`);
    next();
}

// Valida que el campo 'is_active' enviado p/ actualizar sea de tipo Booleano //
const valCampoBool = (req, res, next) => {
    if (req.body.is_active != undefined) {
        if (typeof req.body.is_active != 'boolean')
            return respuestas.error400(res, `La propiedad 'is_active' debe ser de tipo Booleano.`);
    }
    next();
}

const validarCampoPrecio = (req, res, next) => {
    if (req.body.precio != undefined) {
        if (typeof(req.body.precio) != 'number') return respuestas.error400(res, `La propiedad 'precio' debe ser numerica.`);
        if (req.body.precio < 1) return respuestas.error400(res, `La propiedad 'precio' debe ser mayor a 0 (cero).`);
    }
    next();
}

const buscarProdEnCache = (req, res, next) => {
    clienteRedis.get('productos', (error, rep) => {
        console.log(rep);
        if (error) return respuestas.error400(res, 'Ha ocurrido un error inesperado. Contacte al administrador');
        if (rep) return respuestas.ok200(res, 'Lista de Productos:', JSON.parse(rep));
        next();
    });
}

module.exports = { validarProductoExistente, validarProductoActivo, valCamposNuevoProducto, valCampoBool, validarCampoPrecio, buscarProdEnCache }