const nodemailer = require('node-mailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'username@example.com',
        pass: 'userpass'
    }
});

let mailOptions = {
    from: '',
    to: '',
    subject: '',
    text: '',
    html: ''
};

module.exports.sendEmail = function (mailOptions) {
    transporter.sendEmail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}