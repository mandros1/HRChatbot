'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      userHash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      salt: {
        allowNull: false,
        type: Sequelize.STRING
      },
      auth_token: {
        unique: true,
        type: Sequelize.STRING
      },
      auth_token_valid_to: {
        type: Sequelize.BIGINT
      }
    });
  },
  down: queryInterface /* , Sequelize */ => queryInterface.dropTable('Users')
};
