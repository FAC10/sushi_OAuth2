
const hapi = require('hapi');
const inert = require('inert');
const fs = require('fs');
const haj = require('hapi-auth-jwt2');
require('env2')('./config.env');
const routes = require('./routes/routes');
const users = require ('../database/users.js')
const server = new hapi.Server();

server.connection({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  tls: {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem')
  }
});

server.register([inert, haj], (err) => {
  if (err) throw err;

  const validate = (token, request, callback) => {
    console.log("token", token); // decoded token, it automatically decodes it
    if (!users[token.user.user_id]) {
      return callback(null, false);
    }
    return callback(null, true);
  }

  const strategyOptions = {
    key: process.env.JWT_SECRET,
    validateFunc: validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  }

  server.auth.strategy('jwt', 'jwt', strategyOptions);

  server.route(routes);
})

module.exports = server;
