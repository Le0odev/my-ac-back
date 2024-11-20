const HistoricoServico = require('../models/HistoricoServico');
const Empresa = require('../models/Empresa');

class HistoricoServicoController {
  // Criar um novo histórico de serviço
  static async create(req, res) {
    try {
      const { status, empresaId } = req.body;

      // Verificar se a empresa existe
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Criar o histórico de serviço
      const historicoServico = await HistoricoServico.create({
        status,
        empresaId,
      });

      return res.status(201).json(historicoServico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar histórico de serviço' });
    }
  }

  // Listar todos os históricos de serviço
  static async list(req, res) {
    try {
      const historicos = await HistoricoServico.findAll({
        include: [
          {
            model: Empresa,
            attributes: ['id', 'nome'], // Ajuste de acordo com os atributos da empresa que você quer retornar
          },
        ],
      });

      return res.status(200).json(historicos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar históricos de serviço' });
    }
  }

  // Buscar um histórico de serviço por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const historicoServico = await HistoricoServico.findByPk(id, {
        include: [
          {
            model: Empresa,
            attributes: ['id', 'nome'],
          },
        ],
      });

      if (!historicoServico) {
        return res.status(404).json({ error: 'Histórico de serviço não encontrado' });
      }

      return res.status(200).json(historicoServico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar histórico de serviço' });
    }
  }

  // Atualizar um histórico de serviço
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { status, empresaId } = req.body;

      // Verificar se a empresa existe
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      const historicoServico = await HistoricoServico.findByPk(id);
      if (!historicoServico) {
        return res.status(404).json({ error: 'Histórico de serviço não encontrado' });
      }

      // Atualizar o histórico de serviço
      historicoServico.status = status || historicoServico.status;
      historicoServico.empresaId = empresaId || historicoServico.empresaId;

      await historicoServico.save();

      return res.status(200).json(historicoServico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar histórico de serviço' });
    }
  }

  // Deletar um histórico de serviço
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const historicoServico = await HistoricoServico.findByPk(id);
      if (!historicoServico) {
        return res.status(404).json({ error: 'Histórico de serviço não encontrado' });
      }

      await historicoServico.destroy();

      return res.status(200).json({ message: 'Histórico de serviço deletado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar histórico de serviço' });
    }
  }
}

module.exports = HistoricoServicoController;
