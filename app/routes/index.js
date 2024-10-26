const express = require('express');
const router = express.Router();

const session = require('../models/session');
const company = require('../models/company');
const user = require('../models/user');

const myUser = session.getUser();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Inicio',
    menu: true,
    sessionUser: session.getUser(),
  });
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Inicio de sesión',
    menu: false,
  });
});

if (myUser.hasPermission('view_reports'))
  router.get('/reports', (req, res) => {
    res.render('reports', {
      title: 'Reportes',
      menu: true,
    });
  });

if (myUser.hasPermission('view_lands'))
  router.get('/lands', (req, res) => {
    res.render('lands', {
      title: 'Terrenos',
      menu: true,
    });
  });

if (myUser.hasPermission('manage_users') ||
    myUser.hasPermission('manage_reports') ||
    myUser.hasPermission('manage_lands'))
  router.get('/settings', (req, res) => {
    res.render('settings', {
      title: 'Configuración',
      menu: true,
    });
  });


if (myUser.hasPermission('manage_users'))
  router.get('/settings/users', (req, res) => {
    res.render('users/index', {
      title: 'Usuarios',
      menu: true,
      clients: user.getClients(),
      employees: user.getEmployees(),
      deleted: user.getDeleted(),
    });
  });

if (myUser.hasPermission('manage_users'))
  router.get('/settings/users/add', (req, res) => {
    res.render('users/add', {
      title: 'Usuarios',
      menu: true,
      sessionUser: session.getUser(),
      companies: company.getAll(),
    });
  });

router.get('/404', (req, res) => {
  res.render('404', {
    title: 'Página no encontrada',
    menu: false,
  });
});

router.get('*', (req, res) => {
  res.redirect('/404');
});

module.exports = router;
