// Aided with basic GitHub coding tools
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var Express = require('express').Express;

// Swagger options
var _options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Supply Chain Management API',
      version: '1.0.0',
      description: 'API documentation for the Supply Chain Management system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

// Initialize swagger-jsdoc
var _specs = swaggerJsdoc(_options);

// Setup Swagger middleware
var setupSwagger = function (app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(_specs));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(_specs);
  });
};