const Prestador = require('../models/Prestador');
const Empresa = require('../models/Empresa');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = {
  async register(req, res) {
    try {
      console.log("Dados recebidos:", req.body);
  
      const { nome, email, senha, empresaId, cpf, status, especialidade, anos_experiencia, certificados, telefone } = req.body;
  
      // Verificando se a empresa existe
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        console.log("Empresa não encontrada para o ID:", empresaId);
        return res.status(400).json({ message: "Empresa não encontrada" });
      }
  
      const prestadorExistente = await Prestador.findOne({ where: { email } });
      if (prestadorExistente) {
        console.log("Email já registrado:", email);
        return res.status(400).json({ message: "Email já cadastrado" });
      }
  
      const hashedPassword = await bcrypt.hash(senha, 10);
  
      const novoPrestador = await Prestador.create({
        nome,
        email,
        senha: hashedPassword,
        cpf,
        empresaId,
        status, 
        especialidade, 
        anos_experiencia, 
        certificados, 
        telefone
      });
  
      console.log("Prestador criado com sucesso:", novoPrestador);
      res.status(201).json({ message: "Prestador criado com sucesso", prestador: novoPrestador });
    } catch (error) {
      console.error("Erro ao registrar prestador:", error.message);
      res.status(500).json({ error: "Erro ao registrar prestador", details: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Buscando o prestador pelo email
      const prestador = await Prestador.findOne({ where: { email } });
      if (!prestador) {
        return res.status(400).json({ error: 'Prestador não encontrado' });
      }

      // Verificando a senha
      const senhaValida = await bcrypt.compare(senha, prestador.senha);
      if (!senhaValida) {
        return res.status(400).json({ error: 'Senha incorreta' });
      }

      // Gerando o token JWT (considerando que a role do prestador é 'prestador')
      const token = jwt.sign(
        { id: prestador.id, role: prestador.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao autenticar prestador' });
    }
  },
};
