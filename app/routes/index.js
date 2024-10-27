const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Inicio',
    menu: true,
  });
});

router.get('/upload', (req, res) => {
  res.render('upload', {
    title: 'Subir CSV',
    menu: true,
  });
});

router.get('/assign', (req, res) => {
  res.render('assign', {
    title: 'Asignar',
    menu: true,
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
