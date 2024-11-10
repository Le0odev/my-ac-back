const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class Cliente extends Model {}

Cliente.init(
  {
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
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/],
          msg: 'CPF deve estar no formato XXX.XXX.XXX-XX',
        },
      },
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Cliente',
  },
  {
    sequelize,
    modelName: 'Cliente',
    tableName: 'Clientes', // Definindo o nome da tabela explicitamente
  }
);

// Criptografar a senha antes de salvar
Cliente.beforeSave(async (cliente, options) => {
  if (cliente.changed('senha')) {
    const salt = await bcrypt.genSalt(10);
    cliente.senha = await bcrypt.hash(cliente.senha, salt);
  }
});

module.exports = Cliente;
