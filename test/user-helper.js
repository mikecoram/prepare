const UserHelper = require('../lib/user-helper');
const TestUser = require('./lib/user');

describe('user helper', () => {
    it('retrieves the correct user', done => {
        let test = async function() {
            let createdUser = await TestUser.createTestUser();
            let user = await UserHelper.getUser(createdUser.id);
    
            if (user.id == createdUser.id) {
                await TestUser.deleteTestUser(createdUser);
                return true;
            }
        }

        test().then((result) => {
            if (result == true)
                done();                
        });
    });
});