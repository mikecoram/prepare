'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var hash = require('../lib/encryption').generatePasswordHash;
    var consts = require('../constants');

    return queryInterface.bulkInsert('Users', [{
      emailAddress: 'tutor@tutor.com',
      password: hash('password1'),
      status: consts.USER_STATUS.ACTIVE,
      role: consts.USER_ROLE.TUTOR,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', [{
      emailAddress:'tutor@tutor.com'
    }], {});
  }
};
