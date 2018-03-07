const Constants = require('../constants');
const UserHelper = require('../lib/user-helper');
const { User } = require('../models');

async function createTestUser() {
    return await User.create({
        emailAddress: "x@x.com",
        password: "password1",
        status: Constants.USER_STATUS.ACTIVE,
        role: Constants.USER_ROLE.USER
    });
}

function deleteTestUser(user) {
    return User.destroy({where: {id: user.id}});
}

describe('user-helper', () => {
    it('retrieves the correct user', done => {
        let test = async function() {
            let createdUser = await createTestUser();
            let user = await UserHelper.getUser(createdUser.id);
    
            if (user.id == createdUser.id) {
                await deleteTestUser(createdUser);
                return true;
            }
        }

        test().then((result) => {
            if (result == true)
                done();                
        });
    });
});