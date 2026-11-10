/*
 * Copyright 2018 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var Client = require('../src/nats').Client;
var connect = require('../src/nats').connect;
var Payload = require('../src/nats').Payload;
var parseFlags = require('../test/helpers/argparser').parseFlags;
var randomBytes = require('crypto').randomBytes;
var log = require('../test/helpers/perflog').log;
var ChildProcess = require('child_process').ChildProcess;
var spawn = require('child_process').spawn;
var Server = require('../test/helpers/nats_server_control').Server;
var startServer = require('../test/helpers/nats_server_control').startServer;
var stopServer = require('../test/helpers/nats_server_control').stopServer;
var appendFileSync = require('fs').appendFileSync;
var mkdtemp = require('fs').mkdtemp;
var join = require('path').join;
var tmpdir = require('os').tmpdir;
var promisify = require('util').promisify;


var args = process.argv.slice(3);
// push the default subject
args.push('test');


var pargs = parseFlags(args , usage, ['count', 'size', 'tag']);
var tag = pargs.options['tag'] || "";
var count = pargs.options['count'] || 1000000;
var loop = parseInt(count.toString(), 10);
var hash = parseInt((loop / 80).toString(), 10);
var size = pargs.options['size'] || 2;
size = parseInt(size.toString(), 10);
var payload = randomBytes(size);
pargs.payload = payload;


var test = process.argv[2];
var testFn : Function;
switch(test) {
    case 'pub':
        testFn = pubTest;
        break;
    case 'sub':
        testFn = subTest;
        break;
    case 'pubsub':
        testFn = pubsubTest;
        break;
    case 'reqrep':
        testFn = reqrepTest;
        break;
    default:
        usage();
}

var nc : Client;
var server: Server;


start()
    .catch(function (ex) {
        console.log("error running test", pargs.server, ": ", ex);
        process.exit(1);
    });

async function start() {
    if(! pargs.server) {
        // create a config file - reqrep needs to have a write_dealine for large volume
        var mktmp = promisify(mkdtemp);
        var dir = await mktmp(join(tmpdir(), "nats"));
        var conf = join(dir, "nats.conf");
        appendFileSync(conf, "write_deadline: \"1000s\"\n");
        server = await startServer(['-c', conf]);
        pargs.server = server.nats;
    }
    nc = await connect({url: pargs.server, payload: Payload.BINARY});
    nc.on('connect', function () {
        testFn();
    });
    nc.on('close', function () {
        if(server) {
            stopServer(server as Server);
        }
    });
}

async function subTest() {
    var i = 0;
    var start = 0;
    var sub = await nc.subscribe(pargs.subject, function (err, msg) {
        i++;
        if(i === 1) {
            start = Date.now();
        }
        if(i % hash === 0) {
            process.stdout.write('=');
        }
    }, {max: loop});
    nc.flush(function () {
        console.log('Waiting for', loop, 'messages');
        try {
            var process = spawn('nats-bench', ['-s', pargs.server || "", '-n', count.toString(), '-ns', '0', '-np', '1', "-ms", size.toString(), "test"]);
            process.stderr.on('data', (data) => {
                var lines = data.toString().split('\n');
                lines.forEach((m: string) => {
                    console.log(m);
                });
            });
            process.stdout.on('data', (data) => {
                var lines = data.toString().split('\n');
                lines.forEach((m: string) => {
                    console.log(m);
                });
            });
        } catch(ex) {
            console.log(ex);
        }
    });

    nc.on('unsubscribe', function () {
        var millis = Date.now() - start;
        var mps = Math.round((loop / (millis / 1000)));
        console.log('\nReceived at ' + mps + ' msgs/sec');
        log('metrics.csv', 'sub', loop, millis, tag);
        nc.close();
    });
}

async function pubTest() {
    var start = Date.now();
    for(var i=0; i < count; i++) {
        nc.publish(pargs.subject, payload);
        if(i % hash === 0) {
            process.stdout.write('=');
        }
    }
    await nc.flush();
    var millis = Date.now() - start;
    var mps = Math.round((loop / (millis / 1000)));
    console.log('\nPublished at ' + mps + ' msgs/sec');
    log('metrics.csv', 'pub', loop, millis, tag);
    nc.close();
}

async function pubsubTest() {
    var nc1 = await connect({url: pargs.server, payload: Payload.STRING});
    var received = 0;
    var sub = await nc1.subscribe(pargs.subject, function (err, msg) {
        received++;
        if(received === loop) {
            var millis = Date.now() - start;
            var mps = Math.round((loop / (millis / 1000)));
            console.log('\npubsub at', mps, 'msgs/sec', '[', loop, "msgs", ']');
            log('metrics.csv', 'pubsub', loop, millis, tag);
            nc1.close();
            nc.close();
        }
    }, {max: loop});


    await nc1.flush();
    await nc.flush();

    var start = Date.now();
    for(var i=0; i < loop; i++) {
        nc.publish(pargs.subject, payload);
        if(i % hash === 0) {
            process.stdout.write('=');
        }
    }
}

async function reqrepTest() {
    var nc2 = await connect({url: pargs.server, payload: Payload.BINARY});
    var r = 0;
    var sub = await nc2.subscribe('request.test', function (err, msg) {
        if(msg.reply) {
            r++;
            nc2.publish(msg.reply, 'ok');
        }
    }, {max: loop});

    await nc2.flush();

    var received = 0;
    var start = Date.now();
    for(var i=1; i <= loop; i++) {
        nc.request('request.test', 60000, payload)
            .then(function (m) {
                received++;
                if(received % hash === 0) {
                    process.stdout.write('=');
                }
                if(received === loop) {
                    var millis = Date.now() - start;
                    var rps = Math.round((loop / (millis / 1000)));
                    console.log('\n' + rps + ' request-responses/sec');

                    var lat = Math.round((millis * 1000) / (loop * 2)); // Request=2, Reponse=2 RTs
                    console.log('Avg round-trip latency', lat, 'microseconds');
                    log('metrics.csv', 'reqrep', loop, millis, tag);
                    nc2.close();
                    nc.close();
                }
            });
    }
}

function usage() {
    console.log('tsnode_perf <pub|sub|pubsub|reqrep> [-s <server>] [-count <count>] [-tag <tag>]');
    process.exit(-1);
}