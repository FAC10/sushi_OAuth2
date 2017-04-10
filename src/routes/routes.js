const request = require('request');
const env = require('env2')('./config.env');

const home = {
  method:'GET',
  path: '/',
  handler: {
    file: 'public/index.html'
  }
}

const login = {
  method: 'GET',
  path: '/login',
  handler: (request, reply) => {
    reply.redirect('https://github.com/login/oauth/authorize?client_id=56767f55a4d06d7f199b');
  }
}

const welcome = {
  method: 'GET',
  path: '/welcome{githubCode?}',
  handler: (req, reply) => {
    request.post(`https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.url.query.code}`,
    (err, response, body) => {
      console.log('body: ' + body);
    })
    reply.redirect('/');
  }
}

module.exports = [
  home,
  login,
  welcome
]
