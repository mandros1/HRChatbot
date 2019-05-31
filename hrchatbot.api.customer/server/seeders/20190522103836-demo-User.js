'use strict';
const controller = require('../controllers/user');


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */

      return queryInterface.bulkInsert('Users', [
        {
        name: 'John Doe',
        email: 'johnDoe123@gmail.com',
        password: 'johndoe123',
        salt: controller.generateHashSalt(16)
      },
      {
        name: 'Jane Doe',
        email: 'janeDoe123@gmail.com',
        password: 'janedoe123',
        salt: controller.generateHashSalt(16)
      },
      {
        name: 'Marin Andros',
        email: 'marinandros@gmail.com',
        password: 'marinandros123',
        salt: controller.generateHashSalt(16)
      }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkDelete('Users', null, {});

  }
};
