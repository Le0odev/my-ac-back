const express = require('express');
const router = express.Router();
const prestadorController = require('../controllers/prestadorController');
const authorize = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // Middleware para upload de arquivos


// Rota de cadastro
router.post('/register-prestador', upload.single('avatar'), prestadorController.register);

// Rota de login
router.post('/login-prestador', prestadorController.login);

router.get('/prestadores', authorize(['empresa']), (req, res) => {
  prestadorController.listPrestadores(req, res);
});

router.get(
  '/prestadores/empresa/:empresaId',
  authorize(['empresa']),
  prestadorController.listPrestadoresPorEmpresa
);


// Rota protegida - Acesso somente para prestadores
router.get('/prestador-dashboard', authorize(['prestador']), (req, res) => {
    res.json({ message: 'Bem-vindo ao painel do prestador!' });
  });
  

module.exports = router;
