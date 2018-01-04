const { User } = require('../models/');

exports.getUser = getUser;

function getUser(userId) {
    return new Promise((resolve, reject) => {
        User.find({
            where: {
                id: userId
            }
        }).then((user) => {
            resolve(user);
        }, (err) => {
            reject(err);
        });
    });
}