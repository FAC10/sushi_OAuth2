const users = require('../database/user.js');

const validate = (token, request, callback) => {
  console.log(token.id); // decoded token, it automatically decodes it
  if (!users[token.user.user_id]) {
    return callback(null, false);
  }
  return callback(null, true);
};

module.exports = validate;
