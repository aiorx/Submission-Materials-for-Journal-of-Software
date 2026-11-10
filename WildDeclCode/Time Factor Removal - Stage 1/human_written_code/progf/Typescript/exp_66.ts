var NowRequest = require('@vercel/node').NowRequest;
var NowResponse = require('@vercel/node').NowResponse;
var promisify = require('util').promisify;
var got = require('got');
var CookieJar = require('tough-cookie').CookieJar;

module.exports = async function (req: NowRequest, res: NowResponse) {;
    var url = req.query.url;
    if (url === null) {
        res.status(400).json({ error: "Missing url parameter." });
        return;
    }
    if (typeof url !== "string") {
        res.status(400).json({ error: "url parameter must be string." });
        return;
    }

    try {
        const cookieJar = new CookieJar();
        const response = await got(url, { cookieJar });

        res.send(response.body);
        return;
    } catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
}
