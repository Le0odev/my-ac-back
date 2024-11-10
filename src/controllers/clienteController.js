const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async register(req, res) {
    try {
      const { nome, email, telefone, senha, cpf, endereco } = req.body;
  
      const clienteExistente = await Cliente.findOne({ where: { email } });
      if (clienteExistente) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }
      
      const clienteExistenteCpf = await Cliente.findOne({ where: { cpf } });
      if (clienteExistenteCpf) {
        return res.status(400).json({ message: 'CPF já cadastrado' });
      }
  
      const novoCliente = await Cliente.create({
        nome,
        email,
        telefone,
        senha,  // Não é necessário criptografar aqui, pois o 'beforeSave' já faz isso.
        cpf,
        endereco,
      });
  
      res.status(201).json(novoCliente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar cliente' });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const cliente = await Cliente.findOne({ where: { email } });

      if (!cliente) {
        return res.status(400).json({ error: 'Email ou senha incorretos' });
      }

      const senhaValida = await bcrypt.compare(senha, cliente.senha);
      if (!senhaValida) {
        return res.status(400).json({ error: 'Email ou senha incorretos' });
      }

      const token = jwt.sign({ id: cliente.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao autenticar cliente' });
    }
  },
};
