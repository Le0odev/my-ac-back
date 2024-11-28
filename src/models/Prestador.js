const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Prestador extends Model {}

Prestador.init(
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
    },
    especialidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anos_experiencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    certificados: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'ativo',
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'prestador',
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Empresas', // Nome da tabela (case-sensitive)
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    avatar: { 
      type: DataTypes.STRING,
      allowNull: true, 
    },
  },
  {
    sequelize,
    modelName: 'Prestador',
    tableName: 'prestadores', 
  }
);

module.exports = Prestador;
