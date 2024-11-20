const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class OrdemServico extends Model {}

OrdemServico.init(
  {
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Aberta', 
    },
    prioridade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endereco_servico: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    data_estimativa: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    custo_estimado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    anexos: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'OrdemServico',
    tableName: 'ordens_servico',
  }
);

module.exports = OrdemServico;
