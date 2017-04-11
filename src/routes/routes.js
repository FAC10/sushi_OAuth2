const request = require('request');
const env = require('env2')('./config.env');
const qs = require('querystring');
// const cookieAuth = require('hapi-auth-cookie');

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
    reply.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
  }
}

const welcome = {
  method: 'GET',
  path: '/welcome{githubCode?}',
  handler: (req, reply) => {
    request.post(`https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.url.query.code}`,
    (err, response, body) => {
      console.log(qs.parse(body));
      // console.log('body: ' + body);
      const access_token = body.split('&')[0].split('=')[1];
      const headers = {
        'User-Agent': 'oauth_github_jwt',
        Authorization: `token ${access_token}`
      };
      const url = 'https://api.github.com/user';

      request.get({url:url, headers:headers}, (error, response, body) => {
        const parsedBody = JSON.parse(body);
        let options = {
          'expiresIn': Date.now() + 24 * 60 * 60 * 1000,
          'subject': 'github-data'
        };
        let payload = {
          'user': {
            'username': parsedBody.login,
            'img_url': parsedBody.avatar_url,
            'user_id': parsedBody.id
          },
          'accessToken': access_token
        };
        console.log(payload);
      })
    })
    reply.redirect('/');
  }
}

const secret = {
  method: 'GET',
  path: '/secret',
  config: {
    auth: 'session',
    handler: (request, reply) => {
      reply('This is the secret page');
    }
  }
}

module.exports = [
  home,
  login,
  welcome,
  secret
]
