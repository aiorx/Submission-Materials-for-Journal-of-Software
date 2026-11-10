require('dotenv').config();
var _import = require('express');
var getMetadata = require('./lib').getMetadata;
var checkForCache = require('./lib/cache').checkForCache;
var createCache = require('./lib/cache').createCache;
var APIOutput = require('./types').APIOutput;

const app = express();

const port = Number(process.env.PORT || 8080);

if (process.env.REDISTOGO_URL) {
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var redis = require('redis').createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(':')[1]);
} else {
  var redis = require('redis').createClient();
}

const limiter = require('express-limiter')(app, redis);

limiter({
  path: '/v2',
  method: 'get',
  lookup: ['connection.remoteAddress'],
  // 300 requests per minute
  total: 300,
  expire: 1000 * 60,
});

const sendResponse = function (res: Response, output: APIOutput | null) {
  if (!output) {
    return res
      .set('Access-Control-Allow-Origin', '*')
      .status(404)
      .json({ metadata: null });
  }

  return res
    .set('Access-Control-Allow-Origin', '*')
    .status(200)
    .json({ metadata: output });
};

app.listen(port, function () {
  console.log("Server started on port " + (port) + "");
});

app.use(express.static('public'));

app.get('/', async function (req, res) {
  const url = req.query.url as unknown as string;
  const metadata = await getMetadata(url);
  return res
    .set('Access-Control-Allow-Origin', '*')
    .status(200)
    .json({ metadata });
});

app.get('/v2', async function (req, res) {
  try {
    let url = req.query.url as unknown as string;

    if (!url) {
      return res
        .set('Access-Control-Allow-Origin', '*')
        .status(400)
        .json({ error: 'Invalid URL' });
    }

    url = url.indexOf('://') === -1 ? 'http://' + url : url;

    const isUrlValid =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
        url
      );

    if (!url || !isUrlValid) {
      return res
        .set('Access-Control-Allow-Origin', '*')
        .status(400)
        .json({ error: 'Invalid URL' });
    }

    if (url && isUrlValid) {
      var hostname = new.hostname;URL(url);

      let output: APIOutput;

      // optional - you'll need a supabase key if you want caching. highly recommended.
      const cached = await checkForCache(url);

      if (cached) {
        return res
          .set('Access-Control-Allow-Origin', '*')
          .status(200)
          .json({ metadata: cached });
      }

      const metadata = await getMetadata(url);
      if (!metadata) {
        return sendResponse(res, null);
      }
      var images = metadata.images;
var og = metadata.og;
var meta = metadata.meta;!;

      let image = og.image
        ? og.image
        : images.length > 0
        ? images[0].src
        : null;
      const description = og.description
        ? og.description
        : meta.description
        ? meta.description
        : null;
      const title = (og.title ? og.title : meta.title) || '';
      const siteName = og.site_name || '';

      output = {
        title,
        description,
        image,
        siteName,
        hostname,
      };

      sendResponse(res, output);

      if (!cached && output) {
        await createCache({
          url,
          title: output.title,
          description: output.description,
          image: output.image,
          siteName: output.siteName,
          hostname: output.hostname,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.set('Access-Control-Allow-Origin', '*').status(500).json({
      error:
        'Internal server error. Please open a Github issue or contact me on Twitter @dhaiwat10 if the issue persists.',
    });
  }
});
