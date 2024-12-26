const { Op } = require('sequelize');
const Estoque = require('../models/Estoque');
const Empresa = require('../models/Empresa');

class EstoqueController {
  // Criar um novo item no estoque
  static async create(req, res) {
    try {
      const {
        nome_produto,
        descricao,
        codigo_interno,
        categoria,
        quantidade,
        unidade,
        preco_unitario,
        estoque_minimo,
        tipo_gas,
        numero_cilindro,
        data_validade,
        empresaId,
      } = req.body;
  
      // Verifica se o código interno já existe
      const itemExistente = await Estoque.findOne({ where: { codigo_interno } });
      if (itemExistente) {
        return res.status(400).json({ 
          error: 'Já existe um item com este código interno.' 
        });
      }
  
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }
  
      const novoItem = await Estoque.create({
        nome_produto,
        descricao,
        codigo_interno,
        categoria,
        quantidade,
        unidade,
        preco_unitario,
        estoque_minimo,
        tipo_gas,
        numero_cilindro,
        data_validade,
        empresaId,
      });
  
      return res.status(201).json({ message: 'Item criado com sucesso!', item: novoItem });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Erro ao criar item no estoque.',
        error: error.message,
      });
    }
  }
  
  

  // Registrar consumo de um item do estoque
  static async registrarConsumo(req, res) {
    try {
      const { produtoId, quantidadeConsumida } = req.body;

      // Validar entrada
      if (!produtoId || !quantidadeConsumida || quantidadeConsumida <= 0) {
        return res.status(400).json({ error: 'Dados inválidos.' });
      }

      // Encontrar o produto no estoque
      const produto = await Estoque.findByPk(produtoId);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      // Atualizar a quantidade no estoque
      if (produto.quantidade < quantidadeConsumida) {
        return res.status(400).json({ error: 'Quantidade insuficiente no estoque.' });
      }

      produto.quantidade -= quantidadeConsumida;
      await produto.save();

      res.status(200).json({ message: 'Consumo registrado com sucesso.', produto });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar consumo.' });
    }
  }

  // Listar todos os itens do estoque
  static async list(req, res) {
    try {
      const { empresaId } = req.query;

      const whereClause = empresaId ? { empresaId } : {}; // Filtrar por empresa, se fornecido
      const itens = await Estoque.findAll({ where: whereClause });

      return res.status(200).json(itens);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao listar itens do estoque.', error: error.message });
    }
  }

  // Buscar item do estoque por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await Estoque.findByPk(id);

      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
      }

      return res.status(200).json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar item no estoque.', error: error.message });
    }
  }

  // Atualizar um item do estoque
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const item = await Estoque.findByPk(id);

      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
      }

      await item.update(updates);
      return res.status(200).json({ message: 'Item atualizado com sucesso!', item });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar item do estoque.', error: error.message });
    }
  }

  // Excluir um item do estoque
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const item = await Estoque.findByPk(id);

      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
      }

      await item.destroy();
      return res.status(200).json({ message: 'Item excluído com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao excluir item do estoque.', error: error.message });
    }
  }

  // Listar apenas gases refrigerantes
  static async listGases(req, res) {
    try {
      const { empresaId } = req.query;

      const whereClause = {
        categoria: { [Op.iLike]: 'Gases%' }, // Filtra pela categoria 'Gases'
        ...(empresaId && { empresaId }),
      };

      const gases = await Estoque.findAll({ where: whereClause });

      return res.status(200).json(gases);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao listar gases refrigerantes.', error: error.message });
    }
  }
}

module.exports = EstoqueController;
