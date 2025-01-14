const express = require('express');
const router = express.Router();
const EstoqueController = require('../controllers/estoqueController');
const authorize = require('../middlewares/authMiddleware');

// Apenas empresas podem criar novos itens no estoque
router.post(
  '/estoque',
  authorize(['empresa']),
  EstoqueController.create
);


// Empresas e prestadores da mesma empresa podem listar itens do estoque
router.get(
  '/estoque/:empresaId',
  authorize(['empresa', 'prestador']), // Permitir acesso a empresas e prestadores
  EstoqueController.listItemsByCompany // Usar o método que verifica o vínculo
);


// Empresas e prestadores podem buscar um item específico do estoque por ID
router.get(
  '/estoque/:id',
  authorize(['empresa', 'prestador']),
  EstoqueController.getById
);

// Apenas empresas podem atualizar um item no estoque
router.put(
  '/estoque/:id',
  authorize(['empresa']),
  EstoqueController.update
);

// Apenas empresas podem excluir um item do estoque
router.delete(
  '/estoque/:id',
  authorize(['empresa']),
  EstoqueController.delete
);

// Apenas empresas e prestadores podem listar gases refrigerantes no estoque
router.get(
  '/estoque/gases',
  authorize(['empresa', 'prestador']),
  EstoqueController.listGases
);

// Prestadores podem registrar o uso de um item no estoque ao criar relatórios
router.post(
  '/estoque/consumo',
  authorize(['prestador']),
  EstoqueController.registrarConsumo
);

module.exports = router;
