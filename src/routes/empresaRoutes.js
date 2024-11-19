const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const authorize = require('../middlewares/authMiddleware'); // Importando o middleware de autorização

// Rota de cadastro - sem restrições
router.post('/register', empresaController.register);

// Rota de login - sem restrições
router.post('/login', empresaController.login);

router.get('/admin-dashboard', authorize(['empresa']), (req, res) => {
    res.json({ message: 'Bem-vindo ao painel de administração!' });
});

module.exports = router;
