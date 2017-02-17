var decamelize = require('decamelize');
var camelize = require('camelcase');

module.exports = function (options) {
  function pgConfig () {
    return {
      name: process.env.POSTGRES_NAME,
      host: process.env.POSTGRES_HOST || '127.0.0.1',
      port: process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      nolimit: true,
      fromColumnName: function (attr) {
        return camelize(attr);
      },
      toColumnName: function (attr) {
        return decamelize(attr, '_');
      }
    };
  }

  return {
    'postgresql-store': pgConfig(),
    transport: {
      type: 'web',
      web: {
        timeout: 120000,
        port: options && options.port ? options.port : 10307
      }
    },
    legacy: {error_codes: false, validate: false}, // needed if using Seneca 2.x
    timeout: 120000,
    strict: { add: false, result: false },
    actcache: { active: false }
  };
};
