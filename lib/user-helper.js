exports.getUser = getUser;

const { User } = require('../models/');

async function getUser(userId) {
    return await User.find({
        where: {
            id: userId
        }
    });
}