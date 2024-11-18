const express = require('express');

// Importar rotas específicas
const empresaRoutes = require('./empresaRoutes');
const clienteRoutes = require('./clienteRoutes');
// Aqui você pode adicionar outras rotas futuramente
// Exemplo:
// const prestadorRoutes = require('./prestadorRoutes');

const router = express.Router();

// Registrar as rotas
router.use('/empresa', empresaRoutes);
router.use('/cliente', clienteRoutes);

// Exportar o roteador principal
module.exports = router;
