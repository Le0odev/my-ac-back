const express = require('express');
const router = express.Router();

// Importando as rotas específicas
const clienteRoutes = require('./clienteRoutes');
const empresaRoutes = require('./empresaRoutes');
const prestadorRoutes = require('./prestadorRoutes');
const ordemServicoRoutes = require('./ordemServicoRoutes');
const historicoServicoRoutes = require('./historicoServicoRoutes');
const RelatorioServicoRoutes = require('./relatorioServicoRoutes');


// Usando as rotas nas rotas principais
router.use(clienteRoutes);
router.use(empresaRoutes);
router.use(prestadorRoutes);
router.use(ordemServicoRoutes);
router.use(historicoServicoRoutes);
router.use(RelatorioServicoRoutes);


module.exports = router;
