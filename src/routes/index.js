const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const clienteController = require('../controllers/clienteController');
const prestadorController = require('../controllers/prestadorController');
const authorize = require('../middlewares/authMiddleware');

// Rota de cadastro
router.post('/register', empresaController.register);
router.post('/register-cliente', clienteController.register);
router.post('/register-prestador', prestadorController.register);

// Rota de login
router.post('/login', empresaController.login);
router.post('/login-cliente', clienteController.login);
router.post('/login-prestador', prestadorController.login);

// Rota protegida - Acesso somente para empresas
router.get('/empresa-dashboard', authorize(['empresa']), (req, res) => {
  res.json({ message: 'Bem-vindo ao painel da empresa!' });
});

// Rota protegida - Acesso somente para prestadores
router.get('/prestador-dashboard', authorize(['prestador']), (req, res) => {
  res.json({ message: 'Bem-vindo ao painel do prestador!' });
});

// Rota protegida - Acesso somente para clientes
router.get('/cliente-dashboard', authorize(['cliente']), (req, res) => {
  res.json({ message: 'Bem-vindo ao painel do cliente!' });
});

module.exports = router;
