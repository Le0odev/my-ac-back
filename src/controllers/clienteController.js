const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async register(req, res) {
    try {
      const { nome, email, telefone, senha, cpf, endereco, empresaId } = req.body;

      // Verificando se o email já está registrado
      const clienteExistente = await Cliente.findOne({ where: { email } });
      if (clienteExistente) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Verificando se o CPF já está registrado
      const clienteExistenteCpf = await Cliente.findOne({ where: { cpf } });
      if (clienteExistenteCpf) {
        return res.status(400).json({ message: 'CPF já cadastrado' });
      }

      // Cadastro do novo cliente
      const novoCliente = await Cliente.create({
        nome,
        email,
        telefone,
        senha,
        cpf,
        endereco,
        role: 'cliente', // O role é definido automaticamente como 'cliente'
        empresaId, // Relaciona o cliente à empresa
      });

      res.status(201).json(novoCliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
  },

  // Função para autenticar um cliente
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const cliente = await Cliente.findOne({ where: { email } });

      if (!cliente) {
        return res.status(400).json({ error: 'Email não encontrado' });
      }

      // Verificando a senha
      const senhaValida = await bcrypt.compare(senha, cliente.senha);
      if (!senhaValida) {
        return res.status(400).json({ error: 'Senha incorreta' });
      }

      // Gerando o token JWT para o cliente
      const token = jwt.sign(
        { id: cliente.id, role: cliente.role }, // O payload inclui o ID e o role
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expira em 1 dia
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao autenticar cliente' });
    }
  },
  
  // Função para listar clientes de uma empresa
  async listClientes(req, res) {
    try {
      const empresaId = req.userId; // Usando o ID da empresa, que vem do token

      const clientes = await Cliente.findAll({
        where: { empresaId },
      });

      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar clientes' });
    }
  },

  // Função para buscar um cliente específico
  async getCliente(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findOne({
        where: { id },
      });

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
  },
};
