const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "milonizehere@gmail.com",
    pass: process.env.emailPassword,
  },
});

const sendEmail = async (userEmail, EmailSubject, otp) => {
  transporter.sendMail({
    to: userEmail,
    subject: EmailSubject,
    html: `
    <h1>Hello!</h1>
    <p><b>Email: </b>${userEmail}</p>
    <p><b>Otp: </b>${otp}</p>
    <p>Thank you!</p>
    `,
  });
};

module.exports = sendEmail;
