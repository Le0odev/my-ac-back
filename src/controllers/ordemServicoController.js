const OrdemServico = require("../models/OrdemServico")
const Empresa = require("../models/Empresa")
const Cliente = require("../models/Cliente")
const Prestador = require("../models/Prestador")
const Sequelize = require("sequelize")
const { Op } = require("sequelize")
const moment = require("moment-timezone")

class OrdemServicoController {
  // Criar uma nova Ordem de Serviço
  static async createServiceOrder(req, res) {
    try {
      const {
        empresaId,
        descricao,
        cliente_id,
        prioridade,
        endereco_servico,
        data_estimativa,
        custo_estimado,
        anexos,
        prestador_id,
      } = req.body

      // Verificar se a empresa existe
      const company = await Empresa.findByPk(empresaId)
      if (!company) {
        return res.status(404).json({ error: "Empresa não encontrada" })
      }

      // Convert data_estimativa to UTC
      const dataEstimativaUTC = moment.tz(data_estimativa, "America/Sao_Paulo").utc().format()

      // Use the current date and time for data_criacao in UTC
      const currentDateUTC = moment().utc().format()

      // Criar a ordem de serviço
      const newOrder = await OrdemServico.create({
        empresaId,
        descricao,
        cliente_id,
        prestador_id,
        prioridade,
        endereco_servico,
        data_estimativa: dataEstimativaUTC,
        custo_estimado,
        anexos,
        data_criacao: currentDateUTC,
      })

      return res.status(201).json(newOrder)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Erro ao criar a Ordem de Serviço" })
    }
  }

  // Listar Ordens de Serviço por Empresa
  static async listServiceOrdersByCompany(req, res) {
    try {
      const { empresaId } = req.params

      // Verificar se a empresa existe
      const company = await Empresa.findByPk(empresaId)
      if (!company) {
        return res.status(404).json({ error: "Empresa não encontrada" })
      }

      // Buscar as ordens de serviço para a empresa
      const orders = await OrdemServico.findAll({
        where: { empresaId },
        include: [
          { model: Cliente, attributes: ["id", "nome"] },
          { model: Prestador, as: "Prestador", attributes: ["id", "nome"] },
        ],
      })

      // Convert dates to BRT timezone
      const ordersWithBRTDates = orders.map((order) => {
        const plainOrder = order.get({ plain: true })
        plainOrder.data_estimativa = moment(plainOrder.data_estimativa).tz("America/Sao_Paulo").format()
        plainOrder.data_criacao = moment(plainOrder.data_criacao).tz("America/Sao_Paulo").format()
        return plainOrder
      })

      return res.status(200).json(ordersWithBRTDates)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Erro ao buscar Ordens de Serviço" })
    }
  }

  // Atualizar uma Ordem de Serviço
  static async updateServiceOrder(req, res) {
    try {
      const { id } = req.params
      const { descricao, cliente_id, prioridade, endereco_servico, data_estimativa, custo_estimado, anexos, status } =
        req.body

      // Encontrar a ordem de serviço
      const order = await OrdemServico.findByPk(id)
      if (!order) {
        return res.status(404).json({ error: "Ordem de Serviço não encontrada" })
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
      })

      return res.status(200).json(order)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Erro ao atualizar a Ordem de Serviço" })
    }
  }

  // Deletar uma Ordem de Serviço
  static async deleteServiceOrder(req, res) {
    try {
      const { id } = req.params

      // Encontrar a ordem de serviço
      const order = await OrdemServico.findByPk(id)
      if (!order) {
        return res.status(404).json({ error: "Ordem de Serviço não encontrada" })
      }

      // Deletar a ordem
      await order.destroy()

      return res.status(200).json({ message: "Ordem de Serviço deletada com sucesso" })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Erro ao deletar a Ordem de Serviço" })
    }
  }

  static async getQuickStats(req, res) {
    try {
      const { empresaId } = req.params

      // Verificar se a empresa existe
      const company = await Empresa.findByPk(empresaId)
      if (!company) {
        return res.status(404).json({ error: "Empresa não encontrada" })
      }

      // Obter estatísticas
      const totalOrders = await OrdemServico.count({
        where: { empresaId },
      })

      const activeOrders = await OrdemServico.count({
        where: { empresaId, status: "em_progresso" }, // ou outro status de serviço ativo
      })

      // Calcular a média de custo estimado
      const avgCostResult = await OrdemServico.findAll({
        where: { empresaId },
        attributes: [[Sequelize.fn("AVG", Sequelize.col("custo_estimado")), "avgCost"]],
      })

      // Obter o valor da média de custo estimado e arredondá-lo
      const avgCost = avgCostResult[0]?.dataValues?.avgCost || 0
      const roundedAvgCost = Number.parseFloat(avgCost).toFixed(2) // Arredondando para 2 casas decimais

      // Retornar as estatísticas agregadas
      return res.status(200).json({
        totalOrders,
        activeOrders,
        avgCost: roundedAvgCost, // Retornando o valor arredondado
      })
    } catch (error) {
      console.error("Erro ao obter as estatísticas:", error)
      return res.status(500).json({ error: "Erro ao obter estatísticas" })
    }
  }

  static async getRecentOrders(req, res) {
    try {
      const { empresaId } = req.params

      // Verificar se a empresa existe
      const company = await Empresa.findByPk(empresaId)
      if (!company) {
        return res.status(404).json({ error: "Empresa não encontrada" })
      }

      // Obter as ordens mais recentes, excluindo ordens concluídas
      const recentOrders = await OrdemServico.findAll({
        where: {
          empresaId,
          status: { [Sequelize.Op.ne]: "concluido" }, // Excluindo ordens concluídas
        },
        order: [["data_criacao", "DESC"]], // Ordenar pela data de criação, mais recente primeiro
        limit: 5, // Limitar para 5 ordens recentes
        attributes: ["id", "descricao", "status", "data_criacao"], // Selecionar os atributos desejados
      })

      // Se não houver ordens recentes
      if (!recentOrders || recentOrders.length === 0) {
        return res.status(200).json({ recentOrders: [] })
      }

      // Retornar as ordens recentes
      return res.status(200).json({
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          descricao: order.descricao,
          status: order.status,
          data_criacao: order.data_criacao,
        })),
      })
    } catch (error) {
      console.error("Erro ao obter ordens recentes:", error)
      return res.status(500).json({ error: "Erro ao obter ordens recentes" })
    }
  }

  static async getAgendaForPrestador(req, res) {
    try {
      const { prestadorId } = req.params
      const { start, end } = req.query

      const prestador = await Prestador.findByPk(prestadorId)
      if (!prestador) {
        return res.status(404).json({ error: "Prestador não encontrado" })
      }

      const startDate = new Date(start)
      const endDate = new Date(end)

      const ordens = await OrdemServico.findAll({
        where: {
          prestador_id: prestadorId,
          data_estimativa: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        include: [{ model: Cliente, as: "Cliente", attributes: ["id", "nome"] }],
        order: [["data_estimativa", "ASC"]],
      })
      return res.status(200).json(ordens)
    } catch (error) {
      console.error("Erro ao buscar agenda do prestador", error)
      return res.status(500).json({ error: "Erro ao buscar agenda do prestador" })
    }
  }

  static async getOrdersForPrestador(req, res) {
    try {
      const { prestadorId } = req.params

      // Verificar se o prestador existe
      const prestador = await Prestador.findByPk(prestadorId)
      if (!prestador) {
        return res.status(404).json({ error: "Prestador não encontrado" })
      }

      // Buscar as ordens de serviço para o prestador
      const orders = await OrdemServico.findAll({
        where: { prestador_id: prestadorId },
        include: [
          { model: Cliente, as: "Cliente", attributes: ["id", "nome"] },
          { model: Empresa, as: "Empresa", attributes: ["id", "nome"] },
        ],
        order: [["createdAt", "DESC"]],
      })

      // Calcular estatísticas
      const totalOrders = orders.length
      const activeOrders = orders.filter((order) => order.status !== "concluido").length
      const completedOrders = orders.filter((order) => order.status === "concluido").length
      const totalEarnings = orders.reduce((sum, order) => sum + (Number.parseFloat(order.valor) || 0), 0)

      return res.status(200).json({
        orders,
        stats: {
          totalOrders,
          activeOrders,
          completedOrders,
          totalEarnings: totalEarnings.toFixed(2),
        },
      })
    } catch (error) {
      console.error("Erro ao obter ordens do prestador:", error)
      return res.status(500).json({ error: "Erro ao obter ordens do prestador" })
    }
  }
}

module.exports = OrdemServicoController

