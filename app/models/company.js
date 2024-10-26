const db = require('./database').get();
const bcrypt = require('bcryptjs');

class Company {
  constructor(id, cif, data = {}) {
    this.id = id;
    this.cif = cif;
    for (const key in data)
      if (key !== 'id' && key !== 'cif')
        this[key] = data[key];
  }
}

/**
 * Check the company fields using regular expressions.
 *
 * @param {object} data The data to check
 * @param {boolean} unknown If the unknown fields are allowed
 * @returns {object} The errors
 */
function check(data, unknown = false) {
  const errors = {};
  for (const key in data) {
    switch (key) {
      case 'cif':
        if (typeof data.cif !== 'string' || !/^[A-Z][0-9]{8}$/.test(data.cif))
          errors.cif = 'The CIF is not valid.';
        break;
      case 'name':
        if (typeof data.name !== 'string' || !/^.{3,50}$/.test(data.name))
          errors.name = 'The name must have between 3 and 50 characters.';
        break;
      case 'email':
        if (data.email !== null && (typeof data.email !== 'string' || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(data.email)))
          errors.email = 'The email is not valid.';
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
 * Check the company fields validity.
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
 * Get the company by the id, cif or email.
 *
 * @param {string} id The id, cif or email
 * @returns {User} The user
 */
function get(id) {
  let query;
  if (Number.isInteger(id))
    query = 'SELECT * FROM companies WHERE id = ?';
  else if (id.includes('@'))
    query = 'SELECT * FROM companies WHERE email LIKE ?';
  else
    query = 'SELECT * FROM companies WHERE cif LIKE ?';
  query += ' AND deleted_at IS NULL LIMIT 1';
  const result = db.prepare(query).get(id);
  return result ? new Company(result.id, result.cif, result) : null;
}

/**
 * Get a list of all the companies.
 *
 * @param {string} search The search term
 * @returns {Company[]} The list of companies
 */
function getAll(search = null) {
  let results;
  if (typeof search === 'string' && search.length > 0)
    results = db.prepare('SELECT * FROM companies WHERE deleted_at IS NULL AND (cif LIKE ? OR name LIKE ? OR email LIKE ?)').all(`%${search}%`, `%${search}%`, `%${search}%`);
  else
    results = db.prepare('SELECT * FROM companies WHERE deleted_at IS NULL').all();
  return results.map(result => new Company(result.id, result.cif, result));
}

/**
 * Create a new company.
 *
 * @param {string} cif The cif
 * @param {string} name The name
 * @param {object} data The additional data
 * @returns {User} The user
 */
async function create(cif, name, data = {}) {
  if (get(cif))
    throw new Error('User already exists');
  validate({ cif, name, ...data });
  const email = data.email || null;
  const phone = data.phone || null;
  const address = data.address || null;
  const stmt = db.prepare('INSERT INTO companies (cif, name, email, phone, address) VALUES (?, ?, ?, ?, ?)');
  stmt.run(cif, name, email, phone, address);
  return get(cif);
}

/**
 * Update the company.
 *
 * @param {Company} company The company
 * @param {object} data The data to update
 * @returns {Company} The company
 */
function update(company, data) {
  validate(data);
  const stmt = db.prepare('UPDATE companies SET ' + Object.keys(data).map(key => `${key} = ?`).join(', ') + ' WHERE id = ?');
  stmt.run(...Object.values(data), company.id);
  return get(company.id);
}

/**
 * Delete the company.
 *
 * @param {Company} company The company
 */
function remove(company) {
  const stmt = db.prepare('UPDATE companies SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?');
  stmt.run(company.id);
}

module.exports = {
  Company,
  get,
  getAll,
  check,
  validate,
  create,
  update,
  remove
};