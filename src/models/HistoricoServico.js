const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class HistoricoServico extends Model {}

HistoricoServico.init(
  {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },{
    sequelize,
    modelName: 'HistoricoServico',
  },
  {
    sequelize,
    modelName: 'HistoricoServico',
    tableName: 'historico_servicos', // Definindo o nome da tabela explicitamente
  }
);

module.exports = HistoricoServico;
