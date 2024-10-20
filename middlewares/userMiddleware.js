//middlewares/userMiddleware.js
const nodemailer = require('nodemailer');

// Hàm gửi email
const sendRegistrationEmail = (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Email của bạn
            pass: process.env.GMAIL_PASS  // Mật khẩu ứng dụng Gmail
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome to Admin Panel',
        text: `Hello ${name},\n\nThank you for registering! Click the link below to log in:\n\nhttp://localhost:3000/loginsystem`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendRegistrationEmail };
