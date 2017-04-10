const home = {
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply.view('index');
  }
}

module.exports = [
  home
]
