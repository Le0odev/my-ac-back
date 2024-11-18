const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Estoque extends Model {}

Estoque.init(
  {
    nome_produto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data_atualizacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },{
    sequelize,
    modelName: 'Estoque',
  },
  {
    sequelize,
    modelName: 'Estoque',
    tableName: 'estoque', // Definindo o nome da tabela explicitamente
  }
);

module.exports = Estoque;
