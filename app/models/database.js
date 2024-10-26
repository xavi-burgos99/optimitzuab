const fs = require('fs');
const Database = require('better-sqlite3');
let config;
// Check if the configuration file exists
if (fs.existsSync('./config/database.js'))
  config = require('../../config/database');
else
  config = require('../../config/database.example');

const catalogTables = [
  'companies',
  'land_types',
  'lands',
  'lands_users',
  'permissions',
  'report_data',
  'report_types',
  'reports',
  'role_permissions',
  'roles',
  'users'
];

let db;

/**
 * Get the database connection. If the connection does not exist, it is created.
 *
 * @returns {Database} The database connection
 */
function get() {
  if (db) return db;
  try {
    db = new Database(`./databases/${config.database}.sqlite`);
  } catch (error) {
    console.error(`Error connecting to database "${config.database}":`, error);
    process.exit(1);
  }
  console.log(`Connected to database "${config.database}".`);
  return db;
}

/**
 * Check if the catalog exists. Verify if some tables are present in the database.
 *
 * @returns {boolean} True if the catalog exists, false otherwise
 */
function catalogExists() {
  const query = `SELECT name FROM sqlite_master WHERE type='table' AND name IN (${catalogTables.map(table => `'${table}'`).join(', ')})`;
  const result = get().prepare(query).all();
  return result.length === catalogTables.length;
}

/**
 * Check if some table of the catalog exists.
 *
 * @returns {boolean} True if some table of the catalog exists, false otherwise
 */
function someTableExists() {
  const query = `SELECT name FROM sqlite_master WHERE type='table' AND name IN (${catalogTables.map(table => `'${table}'`).join(', ')})`;
  const result = get().prepare(query).all();
  return result.length > 0;
}

/**
 * Create the catalog in the database. Use the SQL script in the file `catalog.sql`.
 */
function createCatalog() {
  const fs = require('fs');
  const path = require('path');
  const script = fs.readFileSync(path.join(__dirname, '../../databases/catalog.sql'), 'utf8');
  get().exec(script);
}

/**
 * Initialize the database. Create the catalog if it does not exist.
 */
function initDatabase() {
  if (catalogExists())
    return;
  if (someTableExists())
    throw new Error('Some tables of the catalog are missing.');
  createCatalog();
}

module.exports = {
  get,
  initDatabase
};