const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authorize = require('../middlewares/authMiddleware');


router.post('/register-cliente', clienteController.register);
router.post('/login-cliente', clienteController.login);

// Rota protegida - Acesso somente para clientes
router.get('/cliente-dashboard', authorize(['cliente']), (req, res) => {
    res.json({ message: 'Bem-vindo ao painel do cliente!' });
  });


router.get('/cliente/:id', authorize(['empresa']), (req, res) => {
    clienteController.getCliente(req, res);
});


module.exports = router;