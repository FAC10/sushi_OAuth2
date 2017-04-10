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

module.exports = [
  home,
  login
]
