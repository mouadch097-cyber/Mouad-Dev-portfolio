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
    const safeMessage = escapeHtml(message.trim());

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Contact Message</title>
</head>
<body style="margin:0; padding:0; background-color:#0a192f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a192f; padding:40px 20px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#112240; border-radius:16px; overflow:hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.4); border: 1px solid #1d3557;">

          <tr>
            <td style="background: linear-gradient(135deg, #0a192f 0%, #112240 100%); padding:32px 32px 24px 32px; border-bottom: 2px solid #64ffda;">
              <h1 style="margin:0; font-size:26px; font-weight:700; color:#ffffff; letter-spacing:0.5px;">
                Mouad<span style="color:#64ffda;">.Dev</span>
              </h1>
              <p style="margin:8px 0 0 0; font-size:14px; color:#8892b0;">
                📬 New Contact Message
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">

              <div style="margin-bottom:24px;">
                <p style="margin:0 0 6px 0; font-size:12px; font-weight:600; color:#64ffda; text-transform:uppercase; letter-spacing:1.5px;">From</p>
                <p style="margin:0; font-size:16px; color:#e6f1ff;">
                  <strong>${safeName}</strong>
                </p>
                <a href="mailto:${safeEmail}" style="color:#64ffda; text-decoration:none; font-size:14px;">${safeEmail}</a>
              </div>

              <div style="margin-bottom:24px;">
                <p style="margin:0 0 6px 0; font-size:12px; font-weight:600; color:#64ffda; text-transform:uppercase; letter-spacing:1.5px;">Subject</p>
                <p style="margin:0; font-size:16px; color:#e6f1ff;">${safeSubject}</p>
              </div>

              <div style="margin-bottom:32px;">
                <p style="margin:0 0 6px 0; font-size:12px; font-weight:600; color:#64ffda; text-transform:uppercase; letter-spacing:1.5px;">Message</p>
                <div style="background-color:#0a192f; border-left:3px solid #64ffda; border-radius:8px; padding:20px; margin-top:8px;">
                  <p style="margin:0; font-size:15px; color:#e6f1ff; line-height:1.7; white-space:pre-wrap;">${safeMessage}</p>
                </div>
              </div>

              <div style="text-align:center; margin: 32px 0 8px 0;">
                <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject.trim())}"
                   style="display:inline-block; background: linear-gradient(135deg, #64ffda 0%, #00b8a9 100%); color:#0a192f; text-decoration:none; padding:14px 32px; border-radius:50px; font-weight:700; font-size:15px; letter-spacing:0.3px;">
                  Reply to ${safeName} ✉️
                </a>
              </div>

            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px; background-color:#0a192f; border-top:1px solid #1d3557; text-align:center;">
              <p style="margin:0; font-size:12px; color:#8892b0;">
                Sent from
                <a href="https://mouad-dev-portfolio.vercel.app" style="color:#64ffda; text-decoration:none;">mouad-dev-portfolio.vercel.app</a>
              </p>
              <p style="margin:6px 0 0 0; font-size:11px; color:#495670;">
                © ${new Date().getFullYear()} Mouad.Dev — Code · Build · Innovate
              </p>
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
      from: 'Mouad.Dev <onboarding@resend.dev>',
      to: 'mouadch097@gmail.com',
      replyTo: email.trim(),
      subject: `📩 Portfolio Contact — ${subject.trim()}`,
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
