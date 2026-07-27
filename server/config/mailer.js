const nodemailer = require('nodemailer');

function smtpConfigured() {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  if (!user || !pass) return false;
  if (user.includes('paste-your') || pass.includes('paste-your')) return false;
  return true;
}

const transporter = smtpConfigured()
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

async function sendOtpEmail(to, code) {
  // Local/dev: no real SMTP yet, print OTP so login still works.
  if (!transporter) {
    console.log(`[dev OTP] to=${to} code=${code}`);
    return;
  }

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
