const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Rota de cadastro
router.post('/register', empresaController.register);

// Rota de login
router.post('/login', empresaController.login);

module.exports = router;