const nodemailer = require('nodemailer');

const emailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

const from = process.env.EMAIL_NAME + '<' + process.env.EMAIL_ADDRESS + '>';

function sendEmail (mailOptions) {
    emailer.sendMail(mailOptions, function(err , info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent to \"" + emailTarget + "\" " + info.response);
        }
    });
}

exports.sendAccountCreationEmail = (emailTarget, name, password, type) => {
    let mailOptions = {
        from: from,
        to: emailTarget,
        subject: 'CMP Account Created',
        html: `<h1>CMP Account Created</h1><p>Hello ${name},</br></br>Your account on CCA MoU Portal has been created. Following are the details for your account:</br><b>Email:</b> ${emailTarget}</br><b>Password:</b> ${password}</br><b>Account Type:</b> ${type}</br></br>Regards,</br>CMP Team</p>`
    };

    sendEmail(mailOptions);
}

exports.sendForgotPasswordEmail = (emailTarget, link) => {
    let mailOptions = {
        from: from,
        to: emailTarget,
        subject: 'CMP Forgot Password',
        html: `<h1>CMP Forgot Password</h1><p>Hello,</br></br>To reset your password visit this link: ${link}</br>The link will expire in 1 hour.</br></br>Regards,</br>CMP Team</p>`
    };

    sendEmail(mailOptions);
}