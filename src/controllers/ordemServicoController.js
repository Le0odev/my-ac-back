const OrdemServico = require('../models/ordemServico');
const Empresa = require('../models/Empresa');
const Cliente = require('../models/Cliente');
const Prestador = require('../models/Prestador');

class OrdemServicoController {
  // Criar uma nova Ordem de Serviço
  static async createServiceOrder(req, res) {
    try {
      const { empresaId, descricao, cliente_id, prioridade, endereco_servico, data_estimativa, custo_estimado, anexos } = req.body;

      // Verificar se a empresa existe
      const company = await Empresa.findByPk(empresaId);
      if (!company) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Criar a ordem de serviço
      const newOrder = await OrdemServico.create({
        empresaId,
        descricao,
        cliente_id,
        prioridade,
        endereco_servico,
        data_estimativa,
        custo_estimado,
        anexos,
      });

      return res.status(201).json(newOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar a Ordem de Serviço' });
    }
  }

  // Listar Ordens de Serviço por Empresa
  static async listServiceOrdersByCompany(req, res) {
    try {
      const { empresaId } = req.params;

      // Verificar se a empresa existe
      const company = await Empresa.findByPk(empresaId);
      if (!company) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Buscar as ordens de serviço para a empresa
      const orders = await OrdemServico.findAll({
        where: { empresaId },
        include: [
          { model: Cliente, attributes: ['id', 'nome'] },
          { model: Prestador, attributes: ['id', 'nome'] },
        ],
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar Ordens de Serviço' });
    }
  }

  // Atualizar uma Ordem de Serviço
  static async updateServiceOrder(req, res) {
    try {
      const { id } = req.params;
      const { descricao, cliente_id, prioridade, endereco_servico, data_estimativa, custo_estimado, anexos, status } = req.body;

      // Encontrar a ordem de serviço
      const order = await OrdemServico.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Ordem de Serviço não encontrada' });
      }

      // Atualizar a ordem
      await order.update({
        descricao,
        cliente_id,
        prioridade,
        endereco_servico,
        data_estimativa,
        custo_estimado,
        anexos,
        status,
      });

      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar a Ordem de Serviço' });
    }
  }

  // Deletar uma Ordem de Serviço
  static async deleteServiceOrder(req, res) {
    try {
      const { id } = req.params;

      // Encontrar a ordem de serviço
      const order = await OrdemServico.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Ordem de Serviço não encontrada' });
      }

      // Deletar a ordem
      await order.destroy();

      return res.status(200).json({ message: 'Ordem de Serviço deletada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar a Ordem de Serviço' });
    }
  }
}

module.exports = OrdemServicoController;
