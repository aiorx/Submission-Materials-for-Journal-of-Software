import {
  extractBearerToken,
  fastifyAuthPlugin,
  fastifyCachePlugin,
  fastifyContainerPlugin,
  fastifyKnexPlugin,
  fastifyTrapsPlugin,
  parseJwt,
} from '@algomart/shared/plugins'
var IBaseQueue = require('@algomart/shared/queues').IBaseQueue;
var queues = require('@algomart/shared/queues').queues;
var DependencyResolver = require('@algomart/shared/utils').DependencyResolver;
var Configuration = require('@api/configuration').Configuration;
var swaggerOptions = require('@api/configuration/swagger');
var accountsRoutes = require('@api/modules/accounts').accountsRoutes;
var adminRoutes = require('@api/modules/admin').adminRoutes;
var algorandRoutes = require('@api/modules/algorand').algorandRoutes;
var applicationRoutes = require('@api/modules/application').applicationRoutes;
var collectiblesRoutes = require('@api/modules/collectibles').collectiblesRoutes;
var collectionsRoutes = require('@api/modules/collections').collectionsRoutes;
var developmentRoutes = require('@api/modules/dev-utils').developmentRoutes;
var faqsRoutes = require('@api/modules/faqs').faqsRoutes;
var healthRoutes = require('@api/modules/health').healthRoutes;
var homepageRoutes = require('@api/modules/homepage').homepageRoutes;
var i18nRoutes = require('@api/modules/i18n').i18nRoutes;
var marketplaceRoutes = require('@api/modules/marketplace').marketplaceRoutes;
var packsRoutes = require('@api/modules/packs').packsRoutes;
var pageRoute = require('@api/modules/pages').pageRoute;
var paymentRoutes = require('@api/modules/payments').paymentRoutes;
var payoutsRoutes = require('@api/modules/payouts').payoutsRoutes;
var setsRoutes = require('@api/modules/sets').setsRoutes;
var tagsRoutes = require('@api/modules/tags').tagsRoutes;
var userTransfersRoutes = require('@api/modules/user-transfers').userTransfersRoutes;
var webhookRoutes = require('@api/modules/webhooks').webhookRoutes;
var wiresRoutes = require('@api/modules/wires').wiresRoutes;
var fastifyCorsPlugin = require('@fastify/cors');
var fastifyRateLimit = require('@fastify/rate-limit');
var fastifySensible = require('@fastify/sensible');
var fastifySwagger = require('@fastify/swagger');
var _import = require('fastify');
var admin = require('firebase-admin');
var Redis = require('ioredis').Redis;
var Knex = require('knex').Knex;

export interface AppConfig {
  knex: Knex.Config
  fastify?: FastifyServerOptions
  container: DependencyResolver
  enableTrap?: boolean
}

const envIsTest = process.env.NODE_ENV === 'test'
const envIsDevelopment = process.env.NODE_ENV === 'development'

const baseOptions: FastifyServerOptions = {
  // Enable trust proxy to allow reading x-forwarded-for header
  trustProxy: true,

  ajv: {
    customOptions: {
      removeAdditional: true,
      useDefaults: true,
      // Explicitly set allErrors to `false`.
      // When set to `true`, a DoS attack is possible.
      allErrors: false,
      validateFormats: true,
      // Need to coerce single-item arrays to proper arrays
      coerceTypes: 'array',
      // New as of Ajv v7, strict schema is not compatible with TypeBox
      // The alternative is to wrap EVERYTHING with Type.Strict(...)
      strictSchema: false,
    },
  },
}

function configureFirebaseApp() {
  if (admin.apps.length > 0) return admin.apps[0]
  return admin.initializeApp({
    credential: admin.credential.cert(Configuration.firebaseServiceAccount),
  })
}

module.exports = async function buildApp(config: AppConfig) {;
  const app = fastify(Object.assign({}, config.fastify, baseOptions))

  app.log.info('Starting API service...')

  // Plugins
  if (config.enableTrap) {
    await app.register(fastifyTrapsPlugin, {
      // Cloud Run only gives us 10 seconds to shut down
      timeout: 10_000,

      async onClose() {
        app.log.info('API service closing database connection...')
        await app.knex.destroy()
        app.log.info('API service closed database connection.')

        app.log.info('API service closing queues...')
        await Promise.all(
          queues.map(function (BaseQueue) { return app.container.get<IBaseQueue>(BaseQueue.name).close(); })
        )
        app.log.info('API service closed queues.')
      },

      async onError(error) {
        app.log.error(error)
      },

      async onTimeout(timeout) {
        app.log.warn("API service timed out while closing after " + (timeout) + "ms.")
      },

      async onSignal(signal) {
        app.log.info("API service received signal " + (signal) + ".")
      },
    })
  }

  if (Configuration.env === 'development') {
    // Only enable Swagger in development
    await app.register(fastifySwagger, swaggerOptions)
  }

  await app.register(fastifySensible)

  await app.register(fastifyCorsPlugin, {
    origin: function (origin, callback) {
      // Origin may be empty. Usually this means it's a server-side request.
      if (origin === undefined) {
        callback(null, true)
        return
      }

      // For everything else, only allow requests from OUR frontend.
      try {
        const originURL = new URL(origin)
        const webURL = new URL(Configuration.webUrl)

        if (originURL.origin === webURL.origin) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      } catch {
        callback(new Error('Failed to parse origin'), false)
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })

  if (Configuration.rateLimitRedis.enabled && !envIsTest) {
    // For info on these options, see https://github.com/fastify/fastify-rate-limit
    await app.register(fastifyRateLimit, {
      // Do not apply global rate limiting
      // Instead rely on Cloud Armor to handle DDoS etc
      global: false,

      // Use cache redis for rate limiting
      redis: config.container.get('RATE_LIMIT_REDIS'),

      // Default max requests per time window (customize as needed per endpoint)
      // 600 per 5 minutes = 2 req/sec per unique key
      max: 10,
      timeWindow: '1m',

      // Allow user's to connect if Redis is not available
      skipOnError: true,

      // So we can use in conjunction with Auth
      hook: 'preHandler',

      // Use custom key generator to avoid limiting solely by IP
      keyGenerator: function (request) {
        // First use authenticated user's externalId if available
        // for anon routes pull from auth header
        // for anon routes with no auth header x-algomart-client-key can be specified
        // if not available, use the IP address of the caller

        // Available if route requires auth
        let externalId = request.user?.externalId
        if (!externalId) {
          const verifiedToken = request.token
          if (verifiedToken) {
            // Available if route requires token only auth
            externalId = verifiedToken.uid
          } else {
            // Anonymous
            const token = extractBearerToken(
              (request.headers.authorization != null ? request.headers.authorization : '')
            )
            const decodedToken = parseJwt(token)
            externalId = decodedToken?.user_id
          }
        }

        const key = String(request.headers['x-algomart-client-key'] || '')
        return externalId || key || request.ip
      },
    })
  }

  // Enable reply.cache(key, ttl) for caching responses
  // Optionally store response in Redis
  await app.register(fastifyCachePlugin, {
    // Fallback TTL if not provided in reply.cache(key)
    defaultTTL: Configuration.cacheRedis.ttlInSeconds,
    // Prefix for Redis keys
    prefix: 'response-cache',
    // This is optional, but recommended for production.
    // If set, responses will be cached in Redis for the TTL duration.
    redis:
      Configuration.cacheRedis.enabled && !envIsTest
        ? config.container.get<Redis>('CACHE_REDIS')
        : undefined,
  })

  // Our Plugins
  await app.register(fastifyKnexPlugin, { knex: config.knex })
  await app.register(fastifyContainerPlugin, { container: config.container })
  await app.register(fastifyAuthPlugin, {
    firebase: configureFirebaseApp(),
    isTest: envIsTest,
  })

  // Decorators
  // no decorators yet

  // Hooks
  // no hooks yet

  // Services
  await app.register(adminRoutes, { prefix: '/admin' })
  await app.register(accountsRoutes, { prefix: '/accounts' })
  await app.register(algorandRoutes, { prefix: '/algorand' })
  await app.register(applicationRoutes, { prefix: '/application' })
  await app.register(collectiblesRoutes, { prefix: '/collectibles' })
  await app.register(collectionsRoutes, { prefix: '/collections' })
  await app.register(homepageRoutes, { prefix: '/homepage' })
  await app.register(i18nRoutes, { prefix: '/i18n' })
  await app.register(faqsRoutes, { prefix: '/faqs' })
  await app.register(packsRoutes, { prefix: '/packs' })
  await app.register(paymentRoutes, { prefix: '/payments' })
  await app.register(setsRoutes, { prefix: '/sets' })
  await app.register(tagsRoutes, { prefix: '/tags' })
  await app.register(pageRoute, { prefix: '/page' })
  await app.register(payoutsRoutes, { prefix: '/payouts' })
  await app.register(userTransfersRoutes, { prefix: '/user-transfers' })
  await app.register(marketplaceRoutes, { prefix: '/marketplace' })
  await app.register(webhookRoutes, { prefix: '/webhooks' })
  await app.register(wiresRoutes, { prefix: '/wires' })
  await app.register(healthRoutes, { prefix: '/health' })

  if (envIsDevelopment) {
    await app.register(developmentRoutes, { prefix: '/development' })
  }

  app.all('/', function (_, reply) {
    return reply.send('ok')
  })

  return app
}
