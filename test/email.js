var emailHelper = require('../lib/email');

describe('email', function () {
    it ('sends', function ()  {
        emailHelper.sendMail({
            to: 'mkcoram@gmail.com',
            subject: 'Test email',
            template: 'test',
            context: {
                dateTime: new Date()
            }
        });
    });
});