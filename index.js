require('dotenv').config();
const express = require('express');
const helmet = require('helmet')
const principalRoutes = require('./routes/principalRoutes');
const app = express();
// Swagger //
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Delilah Resto',
            version: '1.0.0'
        }
    },
    apis: ['./docSwagger/*.yaml'],
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(helmet());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());

app.use('', principalRoutes);

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}!`));

module.exports = app;