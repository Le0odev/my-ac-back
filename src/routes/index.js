const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');


// Importando as rotas específicas
const clienteRoutes = require('./clienteRoutes');
const empresaRoutes = require('./empresaRoutes');
const prestadorRoutes = require('./prestadorRoutes');
const ordemServicoRoutes = require('./ordemServicoRoutes');
const historicoServicoRoutes = require('./historicoServicoRoutes');
const RelatorioServicoRoutes = require('./relatorioServicoRoutes');
const estoqueRoutes = require('./estoqueRoutes');

// Usando as rotas nas rotas principais
router.use(clienteRoutes);
router.use(empresaRoutes);
router.use(prestadorRoutes);
router.use(ordemServicoRoutes);
router.use(historicoServicoRoutes);
router.use(RelatorioServicoRoutes);
router.use(estoqueRoutes);

router.get('/verify-token', authorize(['empresa', 'prestador', 'cliente']), (req, res) => {
    const user = {
      id: req.userId,
      name: req.userName,
      email: req.userEmail,
      role: req.userRole,
    };
    res.json({ user });
  });
  

module.exports = router;
