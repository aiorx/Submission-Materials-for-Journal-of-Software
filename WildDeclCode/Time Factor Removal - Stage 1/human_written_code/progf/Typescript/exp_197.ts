/* tslint:disable:no-console */
var Client = require('../tests/helpers/Helper').Client;
var createACDClaim = require('../tests/helpers/createClaims').createACDClaim;

var main = async function () {
  var attributes = {
    name: process.argv[2] || 'testing claim',
    author: process.argv[3] || 'the tester',
    about: [ process.argv[4] ],
  }
  var client = new Client()
  var claim = await createACDClaim(attributes)

  console.log(JSON.stringify(claim, null, 2))

  var response = await client.postWork(claim)
}

main().catch(console.error)
