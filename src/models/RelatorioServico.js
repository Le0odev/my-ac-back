const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class RelatorioServico extends Model {}

RelatorioServico.init(
  {
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },{
    sequelize,
    modelName: 'RelatorioServico',
  },
  {
    sequelize,
    modelName: 'RelatorioServico',
    tableName: 'relatorios_servico', // Definindo o nome da tabela explicitamente
  }
);

module.exports = RelatorioServico;
