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
      defaultValue: DataTypes.NOW,  // Se você deseja que a data de registro seja automática
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Empresas', // Nome da tabela 'Empresas'
        key: 'id',         // Chave estrangeira referenciando a chave primária de Empresas
      },
      onUpdate: 'CASCADE',    // Atualiza os registros relacionados se o valor na tabela 'Empresas' mudar
      onDelete: 'CASCADE',    // Deleta os registros relacionados se o registro na tabela 'Empresas' for removido
    },
  },
  {
    sequelize,
    modelName: 'HistoricoServico',
    tableName: 'historico_servicos', // Certifique-se de que o nome da tabela está correto
  }
);

module.exports = HistoricoServico;
