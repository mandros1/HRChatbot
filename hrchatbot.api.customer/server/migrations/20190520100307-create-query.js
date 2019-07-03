'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Inquiries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        allowNull: false,
        type: Sequelize.STRING
      },
      intent: {
        allowNull: false,
        type: Sequelize.STRING
      },
      intentConfidence: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      entity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING
      },
      entityConfidence: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      jsonPayload: {
        allowNull: false,
        type: Sequelize.STRING(2048)
      },
      // answer: {
      //   type: Sequelize.STRING
      // },
      // confidence: {
      //   type: Sequelize.FLOAT
      // },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Inquiries');
  }
};
