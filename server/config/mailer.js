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

function mailBody(code) {
  return {
    subject: '[Saigon Sister] Your Admin Verification Code',
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  };
}

async function sendViaResend(to, code) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  // Free Resend test sender; swap MAIL_FROM after you verify a domain.
  const from = process.env.MAIL_FROM || 'Saigon Sister <onboarding@resend.dev>';
  const body = mailBody(code);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: body.subject,
      text: body.text,
      html: body.html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return true;
}

async function sendViaSmtp(to, code) {
  if (!transporter) return false;

  const from = process.env.MAIL_FROM || 'noreply@saigonsisterrestaurant.com';
  const body = mailBody(code);

  await Promise.race([
    transporter.sendMail({ from, to, ...body }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('SMTP timeout')), 5000);
    }),
  ]);
  return true;
}

async function sendOtpEmail(to, code) {
  // Prefer Resend (HTTP works on Railway). SMTP is local/Mailtrap fallback.
  if (process.env.RESEND_API_KEY) {
    await sendViaResend(to, code);
    console.log(`[OTP] emailed via Resend to=${to}`);
    return;
  }

  if (transporter) {
    await sendViaSmtp(to, code);
    console.log(`[OTP] emailed via SMTP to=${to}`);
    return;
  }

  // No provider: still log so local login works without email setup.
  console.log(`[OTP] to=${to} code=${code} (no RESEND_API_KEY or SMTP; copy from logs)`);
}

module.exports = { sendOtpEmail };
