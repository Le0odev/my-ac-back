const RelatorioServico = require('../models/RelatorioServico');
const Empresa = require('../models/Empresa');
const Prestador = require('../models/Prestador');
const OrdemServico = require('../models/OrdemServico');

class RelatorioServicoController {
  // Criar um novo relatório de serviço
  static async create(req, res) {
    try {
      const { descricao, empresaId, prestadorId, custo_total, ordemServicoId } = req.body;

      // Verificar se a empresa existe
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Verificar se o prestador existe (opcional, se necessário)
      const prestador = prestadorId ? await Prestador.findByPk(prestadorId) : null;
      if (prestadorId && !prestador) {
        return res.status(404).json({ error: 'Prestador não encontrado' });
      }

      // Criar o relatório de serviço
      const relatorioServico = await RelatorioServico.create({
        descricao,
        empresaId,
        prestadorId,
        custo_total,
        ordemServicoId
      });

      return res.status(201).json(relatorioServico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar relatório de serviço' });
    }
  }

  // Listar todos os relatórios de serviço
  static async list(req, res) {
    try {
      const relatorios = await RelatorioServico.findAll({
        include: [
          {
            model: Empresa,
            as: 'empresa',
            attributes: ['id', 'nome'], // Ajuste os atributos necessários
          },
          {
            model: Prestador,
            as: 'prestador',
            attributes: ['id', 'nome'], // Ajuste os atributos necessários
          },
          {
            model: OrdemServico,
            as: 'ordemServico',
            attributes: ['id', 'descricao', 'status', 'custo_estimado']
          }
        ],
      });

      return res.status(200).json(relatorios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar relatórios de serviço' });
    }
  }

  // Buscar um relatório de serviço por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const relatorioServico = await RelatorioServico.findByPk(id, {
        include: [
          {
            model: Empresa,
            as: 'empresa',
            attributes: ['id', 'nome'],
          },
          {
            model: Prestador,
            as: 'prestador',
            attributes: ['id', 'nome'],
          },
        ],
      });

      if (!relatorioServico) {
        return res.status(404).json({ error: 'Relatório de serviço não encontrado' });
      }

      return res.status(200).json(relatorioServico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar relatório de serviço' });
    }
  }

  // Atualizar um relatório de serviço
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { descricao, empresaId, prestadorId } = req.body;

      // Verificar se o relatório de serviço existe
      const relatorioServico = await RelatorioServico.findByPk(id);
      if (!relatorioServico) {
        return res.status(404).json({ error: 'Relatório de serviço não encontrado' });
      }

      // Verificar se a empresa existe
      if (empresaId) {
        const empresa = await Empresa.findByPk(empresaId);
        if (!empresa) {
          return res.status(404).json({ error: 'Empresa não encontrada' });
        }
      }

      // Verificar se o prestador existe (se informado)
      if (prestadorId) {
        const prestador = await Prestador.findByPk(prestadorId);
        if (!prestador) {
          return res.status(404).json({ error: 'Prestador não encontrado' });
        }
      }

      // Atualizar os campos
      relatorioServico.descricao = descricao || relatorioServico.descricao;
      relatorioServico.empresaId = empresaId || relatorioServico.empresaId;
      relatorioServico.prestadorId = prestadorId || relatorioServico.prestadorId;

      await relatorioServico.save();

      return res.status(200).json(relatorioServico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar relatório de serviço' });
    }
  }

  // Deletar um relatório de serviço
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const relatorioServico = await RelatorioServico.findByPk(id);
      if (!relatorioServico) {
        return res.status(404).json({ error: 'Relatório de serviço não encontrado' });
      }

      await relatorioServico.destroy();

      return res.status(200).json({ message: 'Relatório de serviço deletado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar relatório de serviço' });
    }
  }
}

module.exports = RelatorioServicoController;