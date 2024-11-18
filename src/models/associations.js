const Cliente = require('./Cliente');
const Prestador = require('./Prestador');
const Empresa = require('./Empresa');
const Estoque = require('./Estoque');
const RelatorioServico = require('./RelatorioServico');
const OrdemServico = require('./ordemServico');
const HistoricoServico = require('./HistoricoServico'); // Novo modelo

module.exports = () => {
  // Relacionamentos já existentes
  Cliente.hasMany(OrdemServico, { foreignKey: 'cliente_id' });
  OrdemServico.belongsTo(Cliente, { foreignKey: 'cliente_id' });

  Prestador.hasMany(OrdemServico, { foreignKey: 'prestador_id' });
  OrdemServico.belongsTo(Prestador, { foreignKey: 'prestador_id' });

  Empresa.hasMany(Cliente, { foreignKey: 'empresa_id' });
  Cliente.belongsTo(Empresa, { foreignKey: 'empresa_id' });

  Empresa.hasMany(Prestador, { foreignKey: 'empresa_id' });
  Prestador.belongsTo(Empresa, { foreignKey: 'empresa_id' });

  Empresa.hasMany(Estoque, { foreignKey: 'empresa_id' });
  Estoque.belongsTo(Empresa, { foreignKey: 'empresa_id' });

  OrdemServico.hasMany(RelatorioServico, { foreignKey: 'ordem_servico_id' });
  RelatorioServico.belongsTo(OrdemServico, { foreignKey: 'ordem_servico_id' });

  // Novo relacionamento: OrdemServico com HistoricoServico
  OrdemServico.hasMany(HistoricoServico, { foreignKey: 'ordem_servico_id' });
  HistoricoServico.belongsTo(OrdemServico, { foreignKey: 'ordem_servico_id' });

  // Opcional: Relacionar HistoricoServico com Prestador (quem fez a ação no histórico)
  Prestador.hasMany(HistoricoServico, { foreignKey: 'prestador_id' });
  HistoricoServico.belongsTo(Prestador, { foreignKey: 'prestador_id' });
};
