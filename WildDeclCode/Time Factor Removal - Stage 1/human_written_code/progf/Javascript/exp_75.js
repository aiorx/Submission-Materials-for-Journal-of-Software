const hypertrie = require('./')
const ram = require('random-access-memory')

const db = hypertrie(ram)

const batch = new Array(200)
for (var i = 0; i < batch.length; i++) {
  batch[i] = {key: 'a/#' + i, value: '#' + i}
}

db.batch(batch, function () {
  db.createReadStream()
    .on('data', function data { return console.log(data.key); })
    .on('end', function _ { return console.log('(end)'); })
})
