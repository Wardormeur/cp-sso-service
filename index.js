// TODO export those to share w/ tests
var service = 'cp-dojos-service';
var seneca = require('./imports')({});
var config = require('./config/config.js')();

var store = require('seneca-postgres-store');
// seneca.options(config);
seneca.use(store, config['postgresql-store']);
var log = require('cp-logs-lib')({name: service, level: 'warn'});
var util = require('util');
var heapdump = require('heapdump');
var dgram = require('dgram');

config.log = log.log;

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', shutdown);

function shutdown (err) {
  if (err !== void 0 && err.stack !== void 0) {
    console.error(new Date().toString() + ' FATAL: UncaughtException, please report: ' + util.inspect(err));
    console.error(util.inspect(err.stack));
    console.trace();
  }
  process.exit(0);
}

process.on('SIGUSR2', function () {
  var snapshot = '/tmp/cp-dojos-service-' + Date.now() + '.heapsnapshot';
  console.log('Got SIGUSR2, creating heap snapshot: ', snapshot);
  heapdump.writeSnapshot(snapshot, function (err, filename) {
    if (err) console.error('Error creating snapshot:', err);
    console.log('dump written to', filename);
  });
});

require('./migrate-psql-db.js')(function (err) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log('Migrations ok for cp-sso');
  require('./network')(seneca);
});

seneca.ready(function () {
  var message = new Buffer(service);

  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, 11404, 'localhost', function (err, bytes) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    client.close();
  });
  // var escape = require('seneca-postgresql-store/lib/relational-util').escapeStr;
  // ['load', 'list'].forEach(function (cmd) {
  //   seneca.wrap('role: entity, cmd: ' + cmd, function filterFields (args, cb) {
  //     try {
  //       ['limit$', 'skip$'].forEach(function (field) {
  //         if (args.q[field] && args.q[field] !== 'NULL' && !/^[0-9]+$/g.test(args.q[field] + '')) {
  //           throw new Error('Expect limit$, skip$ to be a number');
  //         }
  //       });
  //       if (args.q.sort$) {
  //         if (args.q.sort$ && typeof args.q.sort$ === 'object') {
  //           var order = args.q.sort$;
  //           _.each(order, function (ascdesc, column) {
  //             if (!/^[a-zA-Z0-9_]+$/g.test(column)) {
  //               throw new Error('Unexpect characters in sort$');
  //             }
  //           });
  //         } else {
  //           throw new Error('Expect sort$ to be an object');
  //         }
  //       }
  //       if (args.q.fields$) {
  //         args.q.fields$.forEach(function (field, index) {
  //           args.q.fields$[index] = '\"' + escape(field) + '\"';
  //         });
  //       }
  //       this.prior(args, cb);
  //     } catch (err) {
  //       // cb to avoid seneca-transport to hang while waiting for timeout error
  //       return cb(err);
  //     }
  //   });
  // });
});
