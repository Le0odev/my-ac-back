const Cliente = require('./Cliente');
const Prestador = require('./Prestador');
const Empresa = require('./Empresa');
const Estoque = require('./Estoque');
const RelatorioServico = require('./RelatorioServico');
const HistoricoServico = require('./HistoricoServico');
const OrdemServico = require('./OrdemServico');

module.exports = () => {
  // Relacionamento Cliente e OrdemServico
  Cliente.hasMany(OrdemServico, { foreignKey: 'cliente_id' });
  OrdemServico.belongsTo(Cliente, { foreignKey: 'cliente_id' });

  // Relacionamento Empresa e Cliente
  Empresa.hasMany(Cliente, { foreignKey: 'empresaId' });
  Cliente.belongsTo(Empresa, { foreignKey: 'empresaId' });

  // Relacionamento Empresa e Prestador
  Empresa.hasMany(Prestador, { foreignKey: 'empresaId' });
  Prestador.belongsTo(Empresa, { foreignKey: 'empresaId' });

  // Relacionamento Empresa e Estoque
  Empresa.hasMany(Estoque, { foreignKey: 'empresaId' });
  Estoque.belongsTo(Empresa, { foreignKey: 'empresaId' });

  // Relacionamento OrdemServico e RelatorioServico
  OrdemServico.hasMany(RelatorioServico, { foreignKey: 'ordemServicoId', as: "ordemServico" });
  RelatorioServico.belongsTo(OrdemServico, { foreignKey: 'ordemServicoId', as: 'ordemServico' });

  // Relacionamento Empresa e RelatorioServico
  Empresa.hasMany(RelatorioServico, { foreignKey: 'empresaId', as: 'relatorios' });
  RelatorioServico.belongsTo(Empresa, { foreignKey: 'empresaId',  as: 'empresa' });
  RelatorioServico.belongsTo(Prestador, { foreignKey: 'prestadorId', as: 'prestador' });


  // Relacionamento OrdemServico e HistoricoServico
  OrdemServico.hasMany(HistoricoServico, { foreignKey: 'ordem_servico_id' });
  HistoricoServico.belongsTo(OrdemServico, { foreignKey: 'ordem_servico_id' });

  // Relacionamento Empresa e HistoricoServico
  Empresa.hasMany(HistoricoServico, { foreignKey: 'empresaId' });
  HistoricoServico.belongsTo(Empresa, { foreignKey: 'empresaId' });

  // Relacionamento HistoricoServico e Prestador
  Prestador.hasMany(HistoricoServico, { foreignKey: 'prestador_id' });
  HistoricoServico.belongsTo(Prestador, { foreignKey: 'prestador_id' });

  // Relacionamento OrdemServico e Prestador (com alias)
  Prestador.hasMany(OrdemServico, { foreignKey: 'prestador_id', as: 'ordens' });
  OrdemServico.belongsTo(Prestador, { foreignKey: 'prestador_id', as: 'Prestador' });

  OrdemServico.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'Empresa' });

};
