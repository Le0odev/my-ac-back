const Prestador = require('../models/Prestador');
const Empresa = require('../models/Empresa');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = {
  async register(req, res) {
    try {
      console.log("Dados recebidos:", req.body);
      const { 
        nome, email, senha, empresaId, cpf, status, 
        especialidade, anos_experiencia, certificados, telefone 
      } = req.body;
  
      // Validação de campos obrigatórios
      if (!nome || !email || !senha || !cpf || !empresaId) {
        return res.status(400).json({ message: "Campos obrigatórios faltando!" });
      }
  
      // Verificando se o arquivo foi enviado
      let avatarUrl = null;
      if (req.file) {
        avatarUrl = `/uploads/avatars/${req.file.filename}`;
        console.log("Avatar salvo em:", avatarUrl);
      }
  
      // Verificando se a empresa existe
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        console.log("Empresa não encontrada para o ID:", empresaId);
        return res.status(400).json({ message: "Empresa não encontrada" });
      }
  
      // Verificando se o email já está registrado
      const prestadorExistente = await Prestador.findOne({ where: { email } });
      if (prestadorExistente) {
        console.log("Email já registrado:", email);
        return res.status(400).json({ message: "Email já cadastrado" });
      }
  
      // Hash da senha
      const hashedPassword = await bcrypt.hash(senha, 10);
  
      // Criando o novo prestador
      const novoPrestador = await Prestador.create({
        nome,
        email,
        senha: hashedPassword,
        cpf,
        empresaId,
        status: status || 'ativo', // Definindo status como "ativo" por padrão
        especialidade,
        anos_experiencia,
        certificados,
        telefone,
        avatar: avatarUrl, // Salva o caminho do avatar
      });
  
      console.log("Prestador criado com sucesso:", novoPrestador);
      res.status(201).json({ message: "Prestador criado com sucesso", prestador: novoPrestador });
    } catch (error) {
      console.error("Erro ao registrar prestador:", error.message);
      // Melhorando a resposta de erro com base no tipo de erro
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: "Erro de chave estrangeira", details: error.message });
      }
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
        { expiresIn: '30d' }
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao autenticar prestador' });
    }
  },

  async listPrestadores(req, res) {
    try {
      // Buscando todos os prestadores, podendo incluir a empresa associada se necessário
      const prestadores = await Prestador.findAll({
        include: [{
          model: Empresa, // Incluindo informações da empresa associada
          attributes: ['nome', 'id'], // Escolher os campos da empresa que deseja incluir
        }],
      });

      // Verificando se algum prestador foi encontrado
      if (prestadores.length === 0) {
        return res.status(404).json({ message: "Nenhum prestador encontrado" });
      }

      res.status(200).json({ prestadores });
    } catch (error) {
      console.error("Erro ao listar prestadores:", error.message);
      res.status(500).json({ error: "Erro ao listar prestadores", details: error.message });
    }
  },

  async listPrestadoresPorEmpresa(req, res) {
    try {
        const { empresaId } = req.params; // Pega o ID da empresa da URL

        // Verifica se a empresa existe
        const empresa = await Empresa.findByPk(empresaId);
        if (!empresa) {
            return res.status(404).json({ message: "Empresa não encontrada" });
        }

        // Busca os prestadores associados à empresa
        const prestadores = await Prestador.findAll({
            where: { empresaId }, // Filtra pelo ID da empresa
            include: [{
                model: Empresa,
                attributes: ['nome', 'id'], // Inclui informações da empresa associada
            }],
        });

        // Verifica se há prestadores associados
        if (prestadores.length === 0) {
            return res.status(404).json({ message: "Nenhum prestador encontrado para esta empresa" });
        }

        res.status(200).json({ prestadores });
    } catch (error) {
        console.error("Erro ao listar prestadores por empresa:", error.message);
        res.status(500).json({ error: "Erro ao listar prestadores por empresa", details: error.message });
    }
}
};
