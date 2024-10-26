const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

// Configurar directorio de archivos estáticos
app.use('/assets', express.static('assets'));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(expressLayouts);

// Initialize the app
const initApp = require('./src/init');
initApp();

// Importar rutas
const routes = require('./src/routes/index');
app.use('/', routes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
