const express = require('express');
const router = express.Router();
const prestadorController = require('../controllers/prestadorController');
const authorize = require('../middlewares/authMiddleware');
const { upload, uploadToFirebase } = require('../middlewares/uploadImage'); // Middleware para upload de imagens


// Rota de cadastro
router.post('/register-prestador', upload, uploadToFirebase, prestadorController.register);

// Rota de login
router.post('/login-prestador', prestadorController.login);

router.get('/prestadores/:empresaId', authorize(['empresa']), (req, res) => {
  prestadorController.listPrestadoresPorEmpresa(req, res);
});

router.put('/prestador/:id', authorize(['prestador', 'empresa']), async (req, res) => {
  // Verifica se é um prestador tentando editar
  if (req.user.role === 'prestador' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Prestador só pode atualizar seu próprio perfil' });
  }
  
  // Se for empresa, verifica se o prestador pertence a ela
  if (req.user.role === 'empresa') {
      const prestador = await Prestador.findByPk(req.params.id);
      if (!prestador || prestador.empresaId !== req.user.id) {
          return res.status(403).json({ message: 'Empresa só pode atualizar prestadores vinculados a ela' });
      }
  }
  
  await prestadorController.updatePrestador(req, res);
});

// Rota protegida - Acesso somente para prestadores
router.get('/prestador-dashboard', authorize(['prestador']), (req, res) => {
    res.json({ message: 'Bem-vindo ao painel do prestador!' });
});

router.get('/prestador/:prestadorId', authorize, prestadorController.getPrestadorDetails);


module.exports = router;