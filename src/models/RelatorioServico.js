const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class RelatorioServico extends Model {}

RelatorioServico.init(
  {
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false, // Alterado para obrigatório, pois a descrição geralmente é essencial no relatório
      validate: {
        notEmpty: true, // Garante que a descrição não seja uma string vazia
      },
    },
    custo_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,

    },
    data_criacao: {
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
    ordemServicoId: { // Relacionamento opcional com a Ordem de Serviço, se aplicável
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ordens_servico', // Nome da tabela OrdensServico (ajustar para seu sistema)
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    prestadorId: { // Relacionamento com o prestador de serviço, se necessário
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'prestadores', // Nome da tabela Prestadores (ajustar para seu sistema)
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'RelatorioServico',
    tableName: 'relatorios_servico', // Nome explícito da tabela
    timestamps: false, // Se você não deseja campos createdAt e updatedAt
  }
);

module.exports = RelatorioServico;
