const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(to, code) {
  const from = process.env.MAIL_FROM || 'noreply@saigonsisterrestaurant.com';

  await transporter.sendMail({
    from,
    to,
    subject: '[Saigon Sister] Your Admin Verification Code',
    text: `Your verification code is ${code}. It expires in 5 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 5 minutes.</p>`,
  });
}

module.exports = { sendOtpEmail };
