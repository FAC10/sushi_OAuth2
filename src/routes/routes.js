const request = require('request');
require('env2')('./config.env');
const qs = require('querystring');
const jwt = require('jsonwebtoken');

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

const secure = {
  method: 'GET',
  path: '/secure',
  config: {
    auth: 'jwt'
  },
  handler: (req, reply) => {
    reply('This is the secure page!');
  },
}

const welcome = {
  method: 'GET',
  path: '/welcome{githubCode?}',
  handler: (req, reply) => {
    request.post(`https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.url.query.code}`,
    (err, response, body) => {
      // console.log(qs.parse(body));
      const access_token = body.split('&')[0].split('=')[1];
      console.log("body", body);
      console.log("access_token", access_token);
      const headers = {
        'User-Agent': 'oauth_github_jwt',
        Authorization: `token ${access_token}`
      };
      const url = 'https://api.github.com/user';

      request.get({url:url, headers:headers}, (error, response, body) => {
        if (err) throw err;

        const parsedBody = JSON.parse(body);
        // console.log("parsedBody", parsedBody);
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

        jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
          if (err) return console.log(err);
          // console.log(token);
          let config = {
            path: '/',
            isSecure: process.env.NODE_ENV === 'PRODUCTION'
          }

          // console.log("dis cookie got set!")

          reply
            .redirect('/secure')
            .state('token', token, config);
        });
      }) 
    })
  }
}

module.exports = [
  home,
  login,
  welcome,
  secure
]
