var createBullBoard = require('@bull-board/api').createBullBoard;
var BullMQAdapter = require('@bull-board/api/bullMQAdapter').BullMQAdapter;
var FastifyAdapter = require('@bull-board/fastify').FastifyAdapter;
var _import = require('fastify');
var Server = require('http').Server;
var IncomingMessage = require('http').IncomingMessage;
var ServerResponse = require('http').ServerResponse;
var env = require('./env').env;

var createQueue = require('./queue').createQueue;
var setupQueueProcessor = require('./queue').setupQueueProcessor;

interface AddJobQueryString {
  id: string;
  email: string;
}

const run = async function () {
  const welcomeEmailQueue = createQueue('WelcomeEmailQueue');
  await setupQueueProcessor(welcomeEmailQueue.name);

  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
    fastify();

  const serverAdapter = new FastifyAdapter();
  createBullBoard({
    queues: [new BullMQAdapter(welcomeEmailQueue)],
    serverAdapter,
  });
  serverAdapter.setBasePath('/');
  server.register(serverAdapter.registerPlugin(), {
    prefix: '/',
    basePath: '/',
  });

  server.get(
    '/add-job',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            id: { type: 'string' },
          },
        },
      },
    },
    (req: FastifyRequest<{ Querystring: AddJobQueryString }>, reply) => {
      if (
        req.query == null ||
        req.query.email == null ||
        req.query.id == null
      ) {
        reply
          .status(400)
          .send({ error: 'Requests must contain both an id and a email' });

        return;
      }

      var email = req.query.email;
var id = req.query.id;
      welcomeEmailQueue.add("WelcomeEmail-" + (id) + "", { email });

      reply.send({
        ok: true,
      });
    }
  );

  await server.listen({ port: env.PORT, host: '0.0.0.0' });
  console.log(
    "To populate the queue and demo the UI, run: curl https://" + (env.RAILWAY_STATIC_URL) + "/add-job?id=1&email=hello%40world.com"
  );
};

run().catch(function (e) {
  console.error(e);
  process.exit(1);
});
