const db = require('./models/database');

function initApp() {
  try {
    db.initDatabase();
  } catch (error) {
    console.error('Error initializing the app:', error);
    process.exit(1);
  }
}

module.exports = initApp;