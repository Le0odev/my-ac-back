const express = require('express');
const router = express.Router();
const prestadorController = require('../controllers/prestadorController');
const authorize = require('../middlewares/authMiddleware');

// Rota de cadastro
router.post('/register-prestador', prestadorController.register);

// Rota de login
router.post('/login-prestador', prestadorController.login);

// Rota protegida - Acesso somente para prestadores
router.get('/prestador-dashboard', authorize(['prestador']), (req, res) => {
    res.json({ message: 'Bem-vindo ao painel do prestador!' });
  });
  

module.exports = router;
