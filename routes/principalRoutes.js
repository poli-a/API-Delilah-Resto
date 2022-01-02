const express = require('express');
const router = express.Router();
// Rutas //
const usuarioRoutes = require('./usuariosRoutes');
const pedidosRoutes = require('./pedidosRoutes');
const productosRoutes = require('./productosRoutes');
const mediosDePagoRoutes = require('./mediosDePagoRoutes')
// Middleware //
const validacionesUser = require('../middlewares/usuarioMiddleware');
// Respuestas //
const respuestas = require('../helpers/respuestas');

// Ruta prueba de conexion a API //
router.get('/', (req, res) => respuestas.ok200(res, 'Bienvenido', {}));
// Rutas asociadas a la entidad Usuario //
router.use('/usuarios', usuarioRoutes);
// Rutas asociadas a la entidad Pedidos //
router.use('/pedidos', pedidosRoutes);
// Rutas asociadas a la entidad Productos //
router.use('/productos', productosRoutes);
// Rutas asociadas a la entidad MediosdePago //
router.use('/medios-de-pago', validacionesUser.validarSesion, mediosDePagoRoutes);

module.exports = router;