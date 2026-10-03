const { Resend } = require('resend');

// Helper to escape HTML characters
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  // CORS configuration
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://mouad-dev-portfolio.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5500',
    'http://localhost:5173'
  ];

  const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : 'https://mouad-dev-portfolio.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed'
    });
  }

  // Ensure Resend API key is present in environment
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured in environment variables.');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: RESEND_API_KEY is missing.'
    });
  }

  // Parse body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (parseErr) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON request payload.'
      });
    }
  }

  const { name, email, subject, message } = body || {};

  // Validation: required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields (name, email, subject, message) are required.'
    });
  }

  // Validation: email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address format.'
    });
  }

  try {
    const resend = new Resend(apiKey);

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br/>');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #151d32; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 28px 30px; background: linear-gradient(135deg, #0f172a, #1e293b); border-bottom: 2px solid #00d4ff;">
              <h1 style="margin: 0; font-size: 22px; color: #ffffff; letter-spacing: 0.5px;">
                <span style="color: #ffffff;">Mouad</span><span style="color: #00d4ff;">.</span><span style="color: #00ff88;">Dev</span>
                <span style="font-size: 14px; font-weight: normal; color: #94a3b8; margin-left: 10px;">New Contact Message</span>
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <strong style="color: #00d4ff; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">From:</strong>
                    <div style="font-size: 16px; color: #ffffff; margin-top: 4px;">${safeName} &lt;<a href="mailto:${safeEmail}" style="color: #00ff88; text-decoration: none;">${safeEmail}</a>&gt;</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <strong style="color: #00d4ff; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Subject:</strong>
                    <div style="font-size: 16px; color: #ffffff; margin-top: 4px;">${safeSubject}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
                    <strong style="color: #00d4ff; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px;">Message:</strong>
                    <div style="font-size: 15px; line-height: 1.7; color: #e2e8f0; white-space: pre-line;">${safeMessage}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 25px; text-align: center;">
                    <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject.trim())}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #00d4ff, #00ff88); color: #08111f; text-decoration: none; font-weight: 600; border-radius: 50px; font-size: 14px;">
                      Reply to ${safeName} ✉️
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 30px; background-color: #0f172a; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 12px; color: #64748b;">
              Received via Mouad.Dev Portfolio contact form on Vercel
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['mouadch097@gmail.com'],
      replyTo: email.trim(),
      subject: `New message from ${name.trim()}: ${subject.trim()}`,
      html: htmlContent,
      text: `New message from: ${name.trim()} (${email.trim()})\nSubject: ${subject.trim()}\n\nMessage:\n${message.trim()}`
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to send email via Resend'
      });
    }

    return res.status(200).json({
      success: true,
      id: data ? data.id : null
    });
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while processing message.'
    });
  }
};
