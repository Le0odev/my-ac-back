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
        especialidade, anos_experiencia, certificados, telefone,
        avatarUrl 
      } = req.body;
  
      // Validação de campos obrigatórios
      if (!nome || !email || !senha || !cpf || !empresaId) {
        return res.status(400).json({ message: "Campos obrigatórios faltando!" });
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
        status: status || 'ativo',
        especialidade,
        anos_experiencia,
        certificados,
        telefone,
        avatar: req.body.avatarUrl || null,
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

  async updatePrestador(req, res) {
    try {
        const { id } = req.params;
        const {
            nome, email, senha, status, especialidade,
            anos_experiencia, certificados, telefone, avatarUrl
        } = req.body;

        // Verificar se o prestador existe
        const prestador = await Prestador.findByPk(id);
        if (!prestador) {
            return res.status(404).json({ message: "Prestador não encontrado" });
        }

        // Se um novo email for fornecido, verificar se já não está em uso
        if (email && email !== prestador.email) {
            const emailExistente = await Prestador.findOne({ where: { email } });
            if (emailExistente) {
                return res.status(400).json({ message: "Email já está em uso" });
            }
        }

        // Preparar objeto de atualização
        const updateData = {};
        
        // Adicionar campos apenas se foram fornecidos
        if (nome) updateData.nome = nome;
        if (email) updateData.email = email;
        if (status) updateData.status = status;
        if (especialidade) updateData.especialidade = especialidade;
        if (anos_experiencia) updateData.anos_experiencia = anos_experiencia;
        if (certificados) updateData.certificados = certificados;
        if (telefone) updateData.telefone = telefone;
        if (avatarUrl) updateData.avatar = avatarUrl;

        // Se uma nova senha for fornecida, fazer o hash
        if (senha) {
            updateData.senha = await bcrypt.hash(senha, 10);
        }

        // Atualizar o prestador
        await prestador.update(updateData);

        // Buscar o prestador atualizado com as informações da empresa
        const prestadorAtualizado = await Prestador.findByPk(id, {
            include: [{
                model: Empresa,
                attributes: ['nome', 'id'],
            }],
            // Excluir a senha da resposta
            attributes: { exclude: ['senha'] }
        });

        res.status(200).json({
            message: "Prestador atualizado com sucesso",
            prestador: prestadorAtualizado
        });

    } catch (error) {
        console.error("Erro ao atualizar prestador:", error);
        res.status(500).json({
            error: "Erro ao atualizar prestador",
            details: error.message
        });
    }
},

  async listPrestadoresPorEmpresa(req, res) {
    try {
        const { empresaId } = req.params;

        // Verifica se o ID é válido
        if (!empresaId || isNaN(Number(empresaId))) {
            return res.status(400).json({ message: "ID da empresa inválido" });
        }

        // Verifica se a empresa existe
        const empresa = await Empresa.findByPk(empresaId);
        if (!empresa) {
            return res.status(404).json({ message: "Empresa não encontrada" });
        }

        // Busca prestadores associados à empresa
        const { count, rows: prestadores } = await Prestador.findAndCountAll({
            where: { empresaId },
            include: [{
                model: Empresa,
                attributes: ['nome', 'id'], // Inclui informações da empresa associada
            }],
        });

        // Verifica se há prestadores
        if (count === 0) {
            return res.status(404).json({ message: "Nenhum prestador encontrado para esta empresa" });
        }

        res.status(200).json({
            success: true,
            data: { prestadores },
        });
    } catch (error) {
        console.error("Erro ao listar prestadores por empresa:", error);
        res.status(500).json({
            success: false,
            error: "Erro ao listar prestadores por empresa",
            details: error.message,
        });
    }
  },

  async deletePrestador(req, res) {
    try {
      const { id, empresaId } = req.params; // Agora o empresaId vem dos params
  
      // Verificando se o ID do prestador foi fornecido corretamente
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID do prestador inválido" });
      }
  
      // Verificando se o prestador existe
      const prestador = await Prestador.findByPk(id);
      if (!prestador) {
        return res.status(404).json({ message: "Prestador não encontrado" });
      }
  
      // Verificando se o prestador pertence à empresa fornecida no parâmetro
      if (prestador.empresaId !== Number(empresaId)) {
        return res.status(403).json({ message: "Acesso negado. Prestador não pertence à sua empresa." });
      }
  
      // Removendo o prestador
      await prestador.destroy();
  
      res.status(200).json({ message: "Prestador excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir prestador:", error.message);
      res.status(500).json({ 
        error: "Erro ao excluir prestador", 
        details: error.message 
      });
    }
  },
  
  async getPrestadorDetails(req, res) {
    try {
      const { prestadorId } = req.params;
      
      // Pega o empresaId do token do usuário logado
      const empresaId = req.user.empresaId; // Assumindo que você tem middleware de autenticação
  
      // Validação do ID do prestador
      if (!prestadorId) {
        return res.status(400).json({ 
          message: "ID do prestador é obrigatório" 
        });
      }
  
      // Busca o prestador específico validando a empresa
      const prestador = await Prestador.findOne({
        where: { 
          id: prestadorId,
          empresaId: empresaId // Garante que só retorna prestador da empresa do usuário
        },
        include: [{
          model: Empresa,
          attributes: ['nome', 'id']
        }],
        attributes: { 
          exclude: ['senha'] 
        }
      });
  
      if (!prestador) {
        return res.status(404).json({ 
          message: "Prestador não encontrado ou sem permissão para acessar" 
        });
      }
  
      res.status(200).json({
        success: true,
        data: prestador
      });
  
    } catch (error) {
      console.error("Erro ao buscar detalhes do prestador:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar detalhes do prestador",
        details: error.message
      });
    }
  }
};
