const HistoricoServico = require('../models/HistoricoServico');
const Empresa = require('../models/Empresa');
const OrdemServico = require('../models/OrdemServico');
const Prestador = require('../models/Prestador');

class HistoricoServicoController {
  // Criar um novo histórico de serviço
  static async create(req, res) {
    try {
      const { status, acao, empresaId, ordem_servico_id, prestador_id } = req.body;

      // Verificar se a empresa existe
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Verificar se a ordem de serviço existe
      if (ordem_servico_id) {
        const ordemServico = await OrdemServico.findByPk(ordem_servico_id);
        if (!ordemServico) {
          return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
        }
      }

      // Verificar se o prestador existe
      if (prestador_id) {
        const prestador = await Prestador.findByPk(prestador_id);
        if (!prestador) {
          return res.status(404).json({ error: 'Prestador não encontrado' });
        }
      }

      // Criar o histórico de serviço
      const historicoServico = await HistoricoServico.create({
        status,
        acao,
        empresaId,
        ordem_servico_id,
        prestador_id,
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
          {
            model: OrdemServico,
            attributes: ['id', 'descricao'], // Ajuste os campos da OS que deseja retornar
          },
          {
            model: Prestador,
            attributes: ['id', 'nome'], // Ajuste os campos do Prestador que deseja retornar
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
          {
            model: OrdemServico,
            attributes: ['id', 'descricao'],
          },
          {
            model: Prestador,
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
      const { status, acao, empresaId, ordem_servico_id, prestador_id } = req.body;

      // Verificar se a empresa existe
      if (empresaId) {
        const empresa = await Empresa.findByPk(empresaId);
        if (!empresa) {
          return res.status(404).json({ error: 'Empresa não encontrada' });
        }
      }

      // Verificar se a ordem de serviço existe
      if (ordem_servico_id) {
        const ordemServico = await OrdemServico.findByPk(ordem_servico_id);
        if (!ordemServico) {
          return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
        }
      }

      // Verificar se o prestador existe
      if (prestador_id) {
        const prestador = await Prestador.findByPk(prestador_id);
        if (!prestador) {
          return res.status(404).json({ error: 'Prestador não encontrado' });
        }
      }

      const historicoServico = await HistoricoServico.findByPk(id);
      if (!historicoServico) {
        return res.status(404).json({ error: 'Histórico de serviço não encontrado' });
      }

      // Atualizar o histórico de serviço
      historicoServico.status = status || historicoServico.status;
      historicoServico.acao = acao || historicoServico.acao;
      historicoServico.empresaId = empresaId || historicoServico.empresaId;
      historicoServico.ordem_servico_id = ordem_servico_id || historicoServico.ordem_servico_id;
      historicoServico.prestador_id = prestador_id || historicoServico.prestador_id;

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
