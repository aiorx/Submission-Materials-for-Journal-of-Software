/**
 * What is the most efficient way to walk through a given path
 * 
 * Working with the path as an array, and to .join('.') when needed is
 * faster than working on the path as a string. Having to call
 * .split('.') has a significant impact on the efficiency.
 */

var Benchmark = require('./');

Benchmark.setup(function () {
  var lorem = 'Lorem.ipsum.dolor.sit.amet,.consectetur.adipiscing.elit.Sed.commodo.lorem.purus,.at.ullamcorper.risus.ornare.in.Maecenas.finibus.efficitur.odio.Praesent.in.massa.in.orci.malesuada.scelerisque.Mauris.tristique.mollis.ex.eget.molestie.Duis.eget.venenatis.ex.Nulla.semper,.nibh.eget.tempus.molestie,.orci.justo.aliquam.nulla,.vel.facilisis.justo.magna.quis.est.Cras.turpis.tellus,.tempus.nec.pharetra.nec,.faucibus.sed.mi.In.sit.amet.porta.tellus,.ac.ullamcorper.eros.Mauris.facilisis.rutrum.semper.Aenean.quis.pharetra.tellus.Sed.imperdiet.orci.et.felis.elementum,.nec.porttitor.nisi.rhoncus.Phasellus.vitae.turpis.volutpat,.dapibus.nisl.a,.cursus.dui.Mauris.id.efficitur.elit.Proin.quis.porta.felis.Ut.faucibus.metus.quis.gravida.convallis.Etiam.sed.diam.laoreet,.tincidunt.libero.non,.imperdiet.nisi.Etiam.dignissim.iaculis.quam.vitae.tristique.Nulla.consequat,.diam.at.sodales.varius,.lectus.nunc.fringilla.massa,.eget.suscipit.ex.nisi.consectetur.sapien.Sed.in.nisl.tincidunt,.convallis.arcu.ut,.laoreet.justo.Vestibulum.facilisis.interdum.leo.non.lobortis.Proin.fermentum.auctor.sapien,.id.imperdiet.quam.malesuada.vel.Vivamus.rutrum.dolor.quis.neque.mattis.molestie.Morbi.eget.efficitur.velit.Vestibulum.sed.varius.libero.Fusce';
  var arr = lorem.split('.');
  return { lorem, arr };
});

Benchmark.add('match replace', function ({ lorem }) {
  while (true) {
    var last = lorem.match(/\.([^.]*?)$/g) || [];
    if (last.length === 0) { break; }
    var current = (last[0] || '').replace('.', '');
    var path = lorem;
    lorem = lorem.replace(/\.([^.]*?)$/g, "")
  }
})

Benchmark.add('lastIndexOf slice', function ({ lorem }) {
  while (true) {
    var lastIndex = lorem.lastIndexOf('.');
    if (lastIndex === -1) { break; }
    var current = lorem.slice(lastIndex + 1)
    var path = lorem;
    lorem = lorem.slice(0, lastIndex)
  }
})

Benchmark.add('lastIndexOf substr', function ({ lorem }) {
  while (true) {
    var lastIndex = lorem.lastIndexOf('.');
    if (lastIndex === -1) { break; }
    var current = lorem.substr(lastIndex + 1)
    var path = lorem;
    lorem = lorem.substr(0, lastIndex)
  }
})

Benchmark.add('pop join', function ({ arr }) {
  while (arr.length > 0) {
    var current = arr[arr.length - 1];
    var path = arr.join('.');
    arr.pop();
  }
})

Benchmark.add('pop', function ({ arr }) {
  while (arr.length > 0) {
    var current = arr[arr.length - 1];
    arr.pop();
  }
})

Benchmark.add('split pop join', function ({ lorem, arr }) {
  lorem.split('.');
  while (arr.length > 0) {
    var current = arr[arr.length - 1];
    var path = arr.join('.');
    arr.pop();
  }
})

Benchmark.run();

