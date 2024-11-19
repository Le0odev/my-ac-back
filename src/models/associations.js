const Cliente = require('./Cliente');
const Prestador = require('./Prestador');
const Empresa = require('./Empresa');
const Estoque = require('./Estoque');
const RelatorioServico = require('./RelatorioServico');
const OrdemServico = require('./OrdemServico');
const HistoricoServico = require('./HistoricoServico');

module.exports = () => {
  // Relacionamentos já existentes
  Cliente.hasMany(OrdemServico, { foreignKey: 'cliente_id' });
  OrdemServico.belongsTo(Cliente, { foreignKey: 'cliente_id' });

  Prestador.hasMany(OrdemServico, { foreignKey: 'prestador_id' });
  OrdemServico.belongsTo(Prestador, { foreignKey: 'prestador_id' });

  Empresa.hasMany(Cliente, { foreignKey: 'empresaId' });
  Cliente.belongsTo(Empresa, { foreignKey: 'empresaId' });

  Empresa.hasMany(Prestador, { foreignKey: 'empresaId' });
  Prestador.belongsTo(Empresa, { foreignKey: 'empresaId' });

  Empresa.hasMany(Estoque, { foreignKey: 'empresaId' });
  Estoque.belongsTo(Empresa, { foreignKey: 'empresaId' });

  OrdemServico.hasMany(RelatorioServico, { foreignKey: 'ordem_servico_id' });
  RelatorioServico.belongsTo(OrdemServico, { foreignKey: 'ordem_servico_id' });

  // Relacionamento com empresaId no RelatorioServico
  Empresa.hasMany(RelatorioServico, { foreignKey: 'empresaId' });
  RelatorioServico.belongsTo(Empresa, { foreignKey: 'empresaId' });

  OrdemServico.hasMany(HistoricoServico, { foreignKey: 'ordem_servico_id' });
  HistoricoServico.belongsTo(OrdemServico, { foreignKey: 'ordem_servico_id' });

  // Relacionamento com empresaId no HistoricoServico
  Empresa.hasMany(HistoricoServico, { foreignKey: 'empresaId' });
  HistoricoServico.belongsTo(Empresa, { foreignKey: 'empresaId' });

  // Relacionar HistoricoServico com Prestador (quem fez a ação no histórico)
  Prestador.hasMany(HistoricoServico, { foreignKey: 'prestador_id' });
  HistoricoServico.belongsTo(Prestador, { foreignKey: 'prestador_id' });
};
