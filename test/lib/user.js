exports.createTestUser = createTestUser;
exports.deleteTestUser = deleteTestUser;

const { User } = require('../../models');
const Constants = require('../../constants');

function createTestUser() {
    return User.create({
        emailAddress: "x@x.com",
        password: "password1",
        status: Constants.USER_STATUS.ACTIVE,
        role: Constants.USER_ROLE.USER
    });
}

function deleteTestUser(user) {
    return User.destroy({where: {id: user.id}});
}