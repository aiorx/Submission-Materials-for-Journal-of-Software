///<reference path="types.ts" />

var express = require('express');

var getBankTransfersByUserId = require('./database').getBankTransfersByUserId;
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var router = express.Router();

// Routes

//GET /bankTransfers (scoped-user)
router.get("/", ensureAuthenticated, function (req, res) {
  /* istanbul ignore next */
  var transfers = getBankTransfersByUserId(req.user?.id!);

  res.status(200);
  res.json({ transfers });
});

module.exports = router;
