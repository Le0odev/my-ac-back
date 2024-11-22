const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Estoque extends Model {}

Estoque.init(
  {
    nome_produto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    codigo_interno: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Geral', // Exemplos: 'Peças', 'Consumíveis', 'Equipamentos', 'Gases'
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unidade: {
      type: DataTypes.ENUM('UN', 'KG', 'L'),
      allowNull: false,
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    estoque_minimo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    tipo_gas: {
      type: DataTypes.STRING,
      allowNull: true, // Apenas para gases refrigerantes
    },
    numero_cilindro: {
      type: DataTypes.STRING,
      allowNull: true, // Para rastrear cilindros, se necessário
    },
    data_validade: {
      type: DataTypes.DATE,
      allowNull: true, // Controle de validade para gases
    },
    data_atualizacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Empresas', // Nome da tabela Empresas
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Estoque',
    tableName: 'estoque', // Nome da tabela explicitamente definido
  }
);

module.exports = Estoque;
