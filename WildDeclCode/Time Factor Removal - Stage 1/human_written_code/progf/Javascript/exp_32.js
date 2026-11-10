const Fixtures = require('../index');

// The MongoDB Connection URL
const uri = 'mongodb://localhost:27017/mydb';

// The MongoDB native drive options object
const mongoOpts = {};
// var mongoOpts = {
//   ssl: true,
//   sslValidate: true,
//   sslCA: myCert,
// };

const fixtures = new Fixtures({ 
  dir: 'examples/fixtures', 
  filter: '.*' // optional
});
fixtures
  .connect(uri, mongoOpts)
  .then(function () { return fixtures.unload(); })
  .then(function () { return fixtures.load(); })
  .catch(console.error)
  .finally(function () { return fixtures.disconnect(); });

  
