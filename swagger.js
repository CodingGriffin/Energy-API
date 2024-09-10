const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marco se API',
      version: '1.0.0',
      description: 'Marco se Base API Boilerplate',
    },
  },
  apis: ['./services/*/controllers/*.swagger.yaml', './services/*/controllers/*/*.swagger.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;