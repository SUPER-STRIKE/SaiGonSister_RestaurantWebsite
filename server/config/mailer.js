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
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    })
  : null;

// ponytail: Railway often blocks outbound SMTP; after one failure, stop retrying this process.
let smtpDead = process.env.SMTP_DISABLED === '1';

async function sendOtpEmail(to, code) {
  // Always print OTP to Railway logs so login can continue even if email hangs.
  console.log(`[OTP] to=${to} code=${code}`);

  if (!transporter || smtpDead) return;

  const from = process.env.MAIL_FROM || 'noreply@saigonsisterrestaurant.com';
  const mail = {
    from,
    to,
    subject: '[Saigon Sister] Your Admin Verification Code',
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  };

  // Fire-and-forget with a hard timeout so login never waits on SMTP.
  Promise.race([
    transporter.sendMail(mail),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('SMTP timeout')), 5000);
    }),
  ]).catch((err) => {
    smtpDead = true;
    console.error(`SMTP send failed: ${err.message}`);
    console.warn('SMTP disabled for this process; copy OTP from [OTP] log lines');
  });
}

module.exports = { sendOtpEmail };
