const db = require('./database').get();
const user = require('./user');
const bcrypt = require('bcryptjs');

/**
 * Get the user of the session.
 *
 * @returns {user.User} The user
 */
function getUser() {
  return user.get(1);
}

module.exports = {
  getUser,
};
