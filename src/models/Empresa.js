const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Empresa extends Model {}

Empresa.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Empresa',
},
{
  sequelize,
  modelName: 'Empresa',
  tableName: 'Empresas', // Definindo o nome da tabela explicitamente
}

);

module.exports = Empresa;
