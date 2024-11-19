const express = require('express');
const router = express.Router();

// Importando as rotas específicas
const clienteRoutes = require('./clienteRoutes');
const empresaRoutes = require('./empresaRoutes');
const prestadorRoutes = require('./prestadorRoutes')

// Usando as rotas nas rotas principais
router.use(clienteRoutes);
router.use(empresaRoutes);
router.use(prestadorRoutes)

module.exports = router;
