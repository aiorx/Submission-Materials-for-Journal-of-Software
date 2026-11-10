var NowRequest = require('@now/node').NowRequest;
var NowResponse = require('@now/node').NowResponse;
var Asana = require('../../services').Asana;

module.exports = async function (req: NowRequest, res: NowResponse) {;
  if (req.body && req.body.events && req.body.events.length) await Asana.handleHook(req.body);
  const secret = req.headers["x-hook-secret"];
  if (secret) {
    res.setHeader("X-Hook-Secret", secret);
  }
  res.json({ message: "Ok" });
};
