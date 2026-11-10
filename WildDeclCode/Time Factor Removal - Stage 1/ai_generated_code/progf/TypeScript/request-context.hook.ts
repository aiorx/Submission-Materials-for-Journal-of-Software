// Aided with basic GitHub coding tools
var randomUUID = require('crypto').randomUUID;
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
var fp = require('fastify-plugin');
var RouteContext = require('../types/fastify.d').RouteContext;

/**
 * Request context hook for consistent request handling and tracing
 */
var requestContextHook: FastifyPluginAsync = async function (
  fastify: FastifyInstance,
) {
  // Initialize request context on every request
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Generate unique request ID if not already set by proxy/load balancer
      var requestId =
        (request.headers['x-request-id'] as string) || randomUUID();
      reply.header('x-request-id', requestId);

      // Add tracing header for distributed tracing
      var traceparent =
        (request.headers['traceparent'] as string) ||
        "00-" + (randomUUID().replace(/-/g, '')) + "-" + (randomUUID().slice(0, 16)) + "-01";
      reply.header('traceparent', traceparent);

      // Create route context with useful request info
      var context: RouteContext = {
        requestId,
        startTime: performance.now(),
        authenticated: false, // Will be set by auth hook if applicable
      };

      // Attach context to request
      request.routeContext = context;

      // Add request to active requests tracking
      activeRequests.set(requestId, {
        path: request.url,
        method: request.method,
        startTime: context.startTime,
        ip: request.ip,
        userAgent: request.headers['user-agent'] as string,
      });

      // Structured logging of request start with proper context
      fastify.log.info({
        requestId,
        msg: "Request started: " + (request.method) + " " + (request.url) + "",
        path: request.url,
        method: request.method,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        contentType: request.headers['content-type'],
      });
    },
  );

  // Track active requests for monitoring and graceful shutdown
  var activeRequests = new Map<string, any>();

  // Add active requests count to fastify instance
  fastify.decorate('getActiveRequestsCount', () => activeRequests.size);
  fastify.decorate('getActiveRequests', () =>
    Array.from(activeRequests.entries()),
  );

  // Add hook to run after response is sent to client
  fastify.addHook(
    'onResponse',
    (request: FastifyRequest, reply: FastifyReply, done) => {
      var context = request.routeContext as RouteContext;
      var requestId = context.requestId;
var startTime = context.startTime;

      // Calculate request duration
      var duration = performance.now() - startTime;

      // Remove request from active tracking
      activeRequests.delete(requestId);

      // Log response info
      fastify.log.info({
        requestId,
        msg: "Request completed: " + (request.method) + " " + (request.url) + "",
        statusCode: reply.statusCode,
        duration: "" + (duration.toFixed(2)) + "ms",
      });

      // Identify slow requests for optimization
      if (duration > 1000) {
        // Over 1 second is slow
        fastify.log.warn({
          requestId,
          msg: "Slow request detected: " + (request.method) + " " + (request.url) + "",
          duration: "" + (duration.toFixed(2)) + "ms",
          path: request.url,
          method: request.method,
          statusCode: reply.statusCode,
        });
      }

      done();
    },
  );

  // Add hook to catch errors
  fastify.addHook(
    'onError',
    (request: FastifyRequest, reply: FastifyReply, error: Error, done) => {
      var context = request.routeContext as RouteContext;
      var requestId = context.requestId;

      // Enhanced error logging with context
      fastify.log.error({
        requestId,
        err: error,
        msg: "Error during request: " + (request.method) + " " + (request.url) + "",
        path: request.url,
        method: request.method,
        statusCode: reply.statusCode,
      });

      done();
    },
  );

  // Add utility to get active route context
  fastify.decorate(
    'getRequestContext',
    (request: FastifyRequest): RouteContext => {
      return request.routeContext as RouteContext;
    },
  );
};

module.exports = fp(requestContextHook, {;
  name: 'requestContext',
  fastify: '4.x',
});
