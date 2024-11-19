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
    tableName: 'estoque', // Definindo o nome da tabela explicitamente
  }
);

module.exports = Estoque;
