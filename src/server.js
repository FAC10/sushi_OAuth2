'use strict'

const hapi = require('hapi');
const inert = require('inert');
const server = new hapi.Server();


server.connection({
  host: 'localhost',
  port: process.env.PORT || 3000
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
