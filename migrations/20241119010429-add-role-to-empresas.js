'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Empresas', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'empresa', // Valor padrão para a nova coluna
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Empresas', 'role');
  },
}
