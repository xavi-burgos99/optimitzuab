const db = require('./models/database');
const user = require('./models/user');
const session = require('./models/session');

function initApp() {
  try {
    db.initDatabase();
  } catch (error) {
    console.error('Error initializing the app:', error);
    process.exit(1);
  }

  //user.create('admin', 'admin', 'admin@admin.com', 'Admin', '', 'admin');
}

module.exports = initApp;