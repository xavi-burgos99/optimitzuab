const db = require('./database').get();
const company = require('./company');
const bcrypt = require('bcryptjs');

class User {
  permissions = [];

  constructor(id, username, data = {}) {
    this.id = id;
    this.username = username;
    for (const key in data)
      if (key !== 'id' && key !== 'username')
        this[key] = data[key];
    if (this.company_id)
      this.company = company.get(this.company_id);
  }

  /**
   * Check if the user has the permission.
   *
   * @param {string} permission The permission
   * @returns {boolean} If the user has the permission
   */
  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}

/**
 * Get a list of the roles.
 *
 * @returns {string[]} The list of roles
 */
function getRoles() {
  return ['admin', 'manager', 'employee', 'client'];
}

/**
 * Check the user fields using regular expressions.
 *
 * @param {object} data The data to check
 * @param {boolean} unknown If the unknown fields are allowed
 * @returns {object} The errors
 */
function check(data, unknown = false) {
  const errors = {};
  for (const key in data) {
    switch (key) {
      case 'username':
        if (typeof data.username !== 'string' || !/^[a-z0-9][a-z0-9_\-.]{1,30}[a-z0-9_]$/.test(data.username))
          errors.username = 'The username must have between 3 and 32 characters, and can only contain lowercase letters, numbers, and special characters ("_", "-", ".").';
        break;
      case 'password':
        if (typeof data.password !== 'string' || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,32}$/.test(data.password))
          errors.password = 'The password must have between 8 and 32 characters, and must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*()_+).';
        break;
      case 'email':
        if (typeof data.email !== 'string' || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(data.email))
          errors.email = 'The email is not valid.';
        break;
      case 'name':
        if (typeof data.name !== 'string' || !/^.{3,50}$/.test(data.name))
          errors.name = 'The name must have between 3 and 50 characters.';
        break;
      case 'surname':
        if (data.surname !== null && (typeof data.surname !== 'string' || !/^.{0,100}$/.test(data.surname)))
          errors.surname = 'The surname must have a maximum of 100 characters.';
        break;
      case 'role':
        if (typeof data.role !== 'string' || !getRoles().includes(data.role))
          errors.role = `The role is not valid (${getRoles().join(', ')}).`;
        break;
      case 'nif':
        if (data.nif !== null && (typeof data.nif !== 'string' || !/^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(data.nif)))
          errors.nif = 'The NIF or NIE is not valid.';
        break;
      case 'phone':
        if (data.phone !== null && (typeof data.phone !== 'string' || !/^\+?[0-9]{0,15}$/.test(data.phone)))
          errors.phone = 'The phone number is not valid.';
        break;
      case 'address':
        if (data.address !== null && (typeof data.address !== 'string' || !/^.{0,300}$/.test(data.address)))
          errors.address = 'The address must have a maximum of 300 characters.';
        break;
      default:
        if (!unknown)
          errors['unknown'] = 'Unknown fields are not allowed.';
    }
  }
  return errors;
}

/**
 * Check the user fields validity.
 *
 * @param {object} data The data to check
 */
function validate(data) {
  const errors = check(data, true);
  if (Object.keys(errors).length) {
    let message = 'Some fields are not valid:';
    for (const key in errors)
      message += ` ${errors[key]}`;
    throw new Error(message);
  }
}

/**
 * Get the user by the id, username or email.
 *
 * @param {string} id The id, username or email
 * @returns {User} The user
 */
function get(id) {
  let query;
  if (Number.isInteger(id))
    query = 'SELECT * FROM users WHERE id = ?';
  else if (id.includes('@'))
    query = 'SELECT * FROM users WHERE email LIKE ?';
  else
    query = 'SELECT * FROM users WHERE username LIKE ?';
  query += ' AND deleted_at IS NULL LIMIT 1';
  const result = db.prepare(query).get(id);
  if (!result)
    return null;
  const permissions = db.prepare('SELECT rp.permission_name FROM role_permissions rp JOIN users u ON rp.role_name = u.role WHERE u.id = ?').all(result.id);
  result.permissions = permissions.map(permission => permission.permission_name);
  return new User(result.id, result.username, result);
}

/**
 * Get a list of all the users.
 *
 * @param {string} search The search term
 * @returns {User[]} The list of users
 */
function getAll(search = null) {
  let results;
  if (typeof search === 'string' && search.length > 0)
    results = db.prepare('SELECT * FROM users WHERE username LIKE ? OR email LIKE ? OR name LIKE ? OR surname LIKE ? ORDER BY username').all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  else
    results = db.prepare('SELECT * FROM users WHERE deleted_at IS NULL ORDER BY username').all();
  return results.map(result => new User(result.id, result.username, result));
}

/**
 * Get a list of all the clients.
 *
 * @param {string} search The search term
 * @returns {User[]} The list of clients
 */
function getClients(search = null) {
  let results;
  if (typeof search === 'string' && search.length > 0)
    results = db.prepare('SELECT u.* FROM users u LEFT JOIN companies c ON u.company_id = c.id WHERE u.role = \'client\' AND u.deleted_at IS NULL AND (u.username LIKE ? OR u.email LIKE ? OR u.name LIKE ? OR u.surname LIKE ? OR c.cif LIKE ? OR c.name LIKE ?) ORDER BY c.id, u.username').all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  else
    results = db.prepare('SELECT * FROM users WHERE role = \'client\' AND deleted_at IS NULL ORDER BY company_id, username').all();
  return results.map(result => new User(result.id, result.username, result));
}

/**
 * Get a list of all the employees.
 *
 * @param {string} search The search term
 * @returns {User[]} The list of employees
 */
function getEmployees(search = null) {
  let results;
  if (typeof search === 'string' && search.length > 0)
    results = db.prepare('SELECT * FROM users WHERE role != \'client\' AND deleted_at IS NULL AND (username LIKE ? OR email LIKE ? OR name LIKE ? OR surname LIKE ?) ORDER BY role, username').all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  else
    results = db.prepare('SELECT * FROM users WHERE role != \'client\' AND deleted_at IS NULL ORDER BY role, username').all();
  return results.map(result => new User(result.id, result.username, result));
}

/**
 * Get a list of all the deleted users.
 *
 * @param {string} search The search term
 * @returns {User[]} The list of deleted users
 */
function getDeleted(search = null) {
  let results;
  if (typeof search === 'string' && search.length > 0)
    results = db.prepare('SELECT * FROM users WHERE deleted_at IS NOT NULL AND (username LIKE ? OR email LIKE ? OR name LIKE ? OR surname LIKE ?) ORDER BY role, username').all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  else
    results = db.prepare('SELECT * FROM users WHERE deleted_at IS NOT NULL ORDER BY role, username').all();
  return results.map(result => new User(result.id, result.username, result));
}

/**
 * Create a new user.
 *
 * @param {string} username The username
 * @param {string} password The password
 * @param {string} email The email
 * @param {string} name The name
 * @param {string} surname The surname
 * @param {string} role The role
 * @param {object} data The additional data
 * @returns {User} The user
 */
async function create(username, password, email, name, surname, role, data = {}) {
  if (get(username) || get(email))
    throw new Error('User already exists');
  validate({ username, password, email, name, surname, role, ...data });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const nif = data.nif || null;
  const phone = data.phone || null;
  const address = data.address || null;
  const stmt = db.prepare('INSERT INTO users (username, password, email, name, surname, role, nif, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(username, hash, email, name, surname, role, nif, phone, address);
  return get(username);
}

/**
 * Update the user.
 *
 * @param {User} user The user
 * @param {object} data The data to update
 * @returns {User} The user
 */
function update(user, data) {
  validate(data);
  const stmt = db.prepare('UPDATE users SET ' + Object.keys(data).map(key => `${key} = ?`).join(', ') + ' WHERE id = ?');
  stmt.run(...Object.values(data), user.id);
  return get(user.id);
}

/**
 * Delete the user.
 *
 * @param {User} user The user
 */
function remove(user) {
  const stmt = db.prepare('UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?');
  stmt.run(user.id);
}

module.exports = {
  User,
  get,
  getAll,
  getClients,
  getEmployees,
  getDeleted,
  getRoles,
  check,
  validate,
  create,
  update,
  remove
};