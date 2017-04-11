'use strict'

const hapi = require('hapi');
const inert = require('inert');
const server = new hapi.Server();
const routes = require('./routes/routes');
const cookieAuth = require('hapi-auth-cookie');

const fs = require('fs');

const tls = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
};

server.connection({
  host: 'localhost',
  port: process.env.PORT || 3000,
  tls: tls
});

server.register([inert, cookieAuth], err => {
  if (err) throw err;

  const options = {
    password: '12345678912345678912345678912345',
    cookie: 'sushi_cookie',
    redirectTo: '/login',
    ttl: 24 * 60 * 60 * 1000
  }

  server.auth.strategy('session', 'cookie', options);
  // server.auth.default('session');

  server.route(routes);
})

module.exports = server;
