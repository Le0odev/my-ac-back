const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rota de cadastro
router.post('/register', clienteController.register);

// Rota de login
router.post('/login', clienteController.login);

module.exports = router;