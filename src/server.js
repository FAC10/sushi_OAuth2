'use strict'

const hapi = require('hapi');
const inert = require('inert');
const server = new hapi.Server();

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

server.register(inert, err => {
  if (err) throw err;

  server.route({
    method:'GET',
    path: '/',
    handler: {
      file: 'public/index.html'
    }
  })
})

module.exports = server;
