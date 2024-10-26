const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Inicio',
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
