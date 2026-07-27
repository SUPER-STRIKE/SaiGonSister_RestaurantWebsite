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
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })
  : null;

async function sendOtpEmail(to, code) {
  // Local/dev or missing SMTP: print OTP so login still works.
  if (!transporter) {
    console.log(`[dev OTP] to=${to} code=${code}`);
    return;
  }

  const from = process.env.MAIL_FROM || 'noreply@saigonsisterrestaurant.com';

  try {
    await transporter.sendMail({
      from,
      to,
      subject: '[Saigon Sister] Your Admin Verification Code',
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
    });
  } catch (err) {
    // Don't block login if Mailtrap/SMTP is down. Read code from Railway logs.
    console.error(`SMTP send failed: ${err.message}`);
    console.log(`[fallback OTP] to=${to} code=${code}`);
  }
}

module.exports = { sendOtpEmail };
