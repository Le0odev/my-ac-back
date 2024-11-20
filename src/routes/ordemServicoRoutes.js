const express = require('express');
const OrdemServicoController = require('../controllers/ordemServicoController');
const authorize = require('../middlewares/authMiddleware'); // Middleware de autorização

const router = express.Router();

// Rotas protegidas
// Apenas administradores e usuários com o role 'empresa' podem criar ordens de serviço
router.post(
  '/ordens-servico',
  authorize(['empresa']),
  OrdemServicoController.createServiceOrder
);

// Apenas administradores e usuários com o role 'empresa' podem listar ordens de serviço por empresa
router.get(
  '/ordens-servico/empresa/:empresaId',
  authorize(['empresa']),
  OrdemServicoController.listServiceOrdersByCompany
);

// Apenas administradores e usuários com o role 'empresa' podem atualizar ordens de serviço
router.put(
  '/ordens-servico/:id',
  authorize(['empresa']),
  OrdemServicoController.updateServiceOrder
);

// Apenas administradores podem excluir ordens de serviço
router.delete(
  '/ordens-servico/:id',
  authorize(['empresa']),
  OrdemServicoController.deleteServiceOrder
);

module.exports = router;