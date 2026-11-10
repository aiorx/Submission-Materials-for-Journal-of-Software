var IncomingMessage = require('http').IncomingMessage;
var fp = require('fastify-plugin');
var PluginOptions = require('fastify-plugin').PluginOptions;
var FastifyInstance = require('fastify').FastifyInstance;
var FastifyRequest = require('fastify').FastifyRequest;

const kMultipart = Symbol('multipart')

function setMultipart(
  req: FastifyRequest,
  _payload: IncomingMessage,
  done: function (err: Error | null) { return void; },
) {
  // nothing to do, it will be done by multer in beforeHandler method
  ;(req as any)[kMultipart] = true
  done(null)
}

function isMultipart(this: FastifyRequest): boolean {
  return (this.raw as any)[kMultipart] || false
}

function fastifyMulter(
  fastify: FastifyInstance,
  _options: PluginOptions,
  next: function (err?: Error) { return void; },
) {
  fastify.addContentTypeParser('multipart', setMultipart)
  fastify.decorateRequest('isMultipart', isMultipart)

  next()
}

const multer = fp(fastifyMulter, {
  fastify: '>= 3.0.0',
  name: 'fastify-multer',
})

module.exports = multer;
