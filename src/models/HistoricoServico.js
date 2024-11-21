const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class HistoricoServico extends Model {}

HistoricoServico.init(
  {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acao: {
      type: DataTypes.STRING,
      allowNull: true, // Descrição opcional da ação realizada
    },
    data_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Data de registro automática
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Empresas', // Nome da tabela 'Empresas'
        key: 'id', // Chave estrangeira referenciando a chave primária de Empresas
      },
      onUpdate: 'CASCADE', // Atualiza os registros relacionados se o valor na tabela 'Empresas' mudar
      onDelete: 'CASCADE', // Deleta os registros relacionados se o registro na tabela 'Empresas' for removido
    },
    ordem_servico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'OrdemServicos', // Nome da tabela 'OrdemServicos'
        key: 'id', // Chave estrangeira referenciando a chave primária de OrdemServicos
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    prestador_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Prestador pode ser opcional em algumas ações
      references: {
        model: 'Prestadores', // Nome da tabela 'Prestadores'
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Define como NULL se o prestador for removido
    },
  },
  {
    sequelize,
    modelName: 'HistoricoServico',
    tableName: 'historico_servicos', // Nome da tabela
  }
);

module.exports = HistoricoServico;
