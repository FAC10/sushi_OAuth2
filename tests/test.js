const test = require('tape');
const server = require('../src/server.js');

test('Check /login route', (t) => {
  const options = {
    method: 'GET',
    url: '/login'
  }
  server.inject(options, (res) => {
    console.log(res);
    t.equal(res.statusCode, 302, 'Should return 302 because it is a redirect(duh!)');
    t.equal(res.headers.location, 'https://github.com/login/oauth/authorize?client_id=56767f55a4d06d7f199b');
    t.end();
  });
})
