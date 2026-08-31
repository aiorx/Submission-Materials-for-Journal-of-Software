// Aided with basic GitHub coding tools
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Swagger options
const _options: swaggerJsdoc.Options = {
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
const _specs = swaggerJsdoc(_options);

// Setup Swagger middleware
export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(_specs));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(_specs);
  });
};