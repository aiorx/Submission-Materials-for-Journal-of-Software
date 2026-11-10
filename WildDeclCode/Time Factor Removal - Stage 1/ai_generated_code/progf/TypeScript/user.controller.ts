// Supported via standard GitHub programming aids
var FastifyInstance = require('fastify').FastifyInstance;
var Type = require('@sinclair/typebox').Type;

/**
 * User-related endpoints
 * @param fastify - Fastify instance
 */
export async function userRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all users
  fastify.get('/users', {
    schema: {
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            name: Type.String(),
            email: Type.String({ format: 'email' }),
            createdAt: Type.String({ format: 'date-time' }),
          })
        ),
      },
    },
  }, async function () {
    try {
      // This is a mock implementation - replace with actual database query
      return [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      fastify.log.error(error);
      throw new Error('Failed to fetch users');
    }
  });

  // Get user by ID
  fastify.get('/users/:id', {
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          email: Type.String({ format: 'email' }),
          createdAt: Type.String({ format: 'date-time' }),
        }),
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
  }, async function (request, reply) {
    var id = request.params.id;as { id: string };
    
    try {
      // This is a mock implementation - replace with actual database query
      if (id === '1') {
        return {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date().toISOString(),
        };
      }
      
      return reply.code(404).send({ message: 'User not found' });
    } catch (error) {
      fastify.log.error(error);
      throw new Error('Failed to fetch user');
    }
  });
}
