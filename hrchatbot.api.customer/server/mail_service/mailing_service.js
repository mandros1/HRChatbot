'use strict';
const nodemailer = require("nodemailer");
const smtpTransporter = require('nodemailer-smtp-transport');

module.exports = {
    send:
        function sendEmail( sendToEmail, subjectHeaderData, textData, htmlData){
            try{
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport(smtpTransporter({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'mpr.hrchatbot@gmail.com', // generated gmail email/username
                        pass: 'hrchatbot123' // generated gmail password
                    }
                }));
                let info = transporter.sendMail({
                    from: "mpr.hrchatbot@gmail.com", // sender address
                    to: sendToEmail, // list of receivers
                    subject: subjectHeaderData, // Subject line
                    text: textData, // plain text body
                    html: htmlData // html body
                });
                console.log("Message sent: %s", info.messageId);
            } catch (e) {
                console.log(`WE HAVE AN ERROR: ${e}`);
            }
        }
};

