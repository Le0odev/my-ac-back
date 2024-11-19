const express = require('express');
const router = express.Router();
const prestadorController = require('../controllers/prestadorController');
const authorize = require('../middlewares/authMiddleware');

// Rota de cadastro de prestador (apenas empresas podem criar prestadores)
router.post('/register', authorize(['empresa']), prestadorController.register);

// Rota de login do prestador
router.post('/login', prestadorController.login);

module.exports = router;
