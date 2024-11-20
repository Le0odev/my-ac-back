const express = require('express');
const HistoricoServicoController = require('../controllers/historicoServicoController');
const authorize = require('../middlewares/authMiddleware'); // Middleware de autorização

const router = express.Router();

// Rotas protegidas
// Apenas administradores e usuários com o role 'empresa' podem criar históricos de serviço
router.post(
  '/historico-servico',
  authorize(['empresa']),
  HistoricoServicoController.create
);

// Apenas administradores e usuários com o role 'empresa' podem listar históricos de serviço
router.get(
  '/historico-servico',
  authorize(['empresa']),
  HistoricoServicoController.list
);

// Apenas administradores e usuários com o role 'empresa' podem buscar histórico de serviço por ID
router.get(
  '/historico-servico/:id',
  authorize(['empresa']),
  HistoricoServicoController.getById
);

// Apenas administradores e usuários com o role 'empresa' podem atualizar históricos de serviço
router.put(
  '/historico-servico/:id',
  authorize(['empresa']),
  HistoricoServicoController.update
);

// Apenas administradores podem excluir históricos de serviço
router.delete(
  '/historico-servico/:id',
  authorize(['empresa']),
  HistoricoServicoController.delete
);

module.exports = router;
