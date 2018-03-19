exports.sendMail = sendMail;

const nodemailer = require('nodemailer');
const handlebars = require('nodemailer-express-handlebars');
const constants = require('../constants');
const tOptions = require('../config/config')[process.env.NODE_ENV || 'development'].email;
const transporter = nodemailer.createTransport(tOptions);

transporter.use('compile', handlebars({
    viewPath: 'views/emails',
    extName: '.hbs'
}));

function sendMail (mailOptions, callback) {
    mailOptions.from = constants.FROM_EMAIL;
    transporter.sendMail(mailOptions, callback || function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}