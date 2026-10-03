# Deployment & Resend Configuration Guide

This project is configured as a static website with a Vercel Serverless Function (`/api/send.js`) using the [Resend](https://resend.com) API to send contact form submissions securely.

---

## 1. Setting up the Resend API Key in Vercel

The API key must **never** be included in front-end HTML/JS files. It is securely read by `/api/send.js` from `process.env.RESEND_API_KEY`.

### Steps:
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project: **`Mouad-Dev-portfolio`** (or `mouad-dev-portfolio`).
3. Navigate to **Settings** > **Environment Variables**.
4. Add a new environment variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `your_resend_api_key_here` (e.g. `re_...`)
   - **Environments:** Check **Production**, **Preview**, and **Development**.
5. Click **Save**.
6. **Redeploy**:
   - Go to the **Deployments** tab in Vercel.
   - Click the three dots (`...`) on the latest deployment and select **Redeploy** (or simply push a new commit to `main`).
   - *Note:* Existing deployments do not automatically inherit newly added environment variables until redeployed.

---

## 2. Testing the Contact Form (Test Mode)

- Currently, Resend is set to send from: `onboarding@resend.dev`.
- In Resend test mode, emails can only be delivered to the verified email address associated with your Resend account (`mouadch097@gmail.com`).
- To test:
  1. Open your live site: `https://mouad-dev-portfolio.vercel.app`
  2. Scroll down to the **Contact** section.
  3. Fill out the form and submit.
  4. You will see: `✅ Message sent successfully!` and receive the email in `mouadch097@gmail.com`.

---

## 3. Verifying a Custom Domain in Resend (Production Mode)

To send emails from your own domain (e.g., `contact@mouad.dev` or `hello@mouad.dev`) instead of `onboarding@resend.dev`:

1. **Add Domain in Resend**:
   - Go to [resend.com/domains](https://resend.com/domains).
   - Click **Add Domain** and enter your domain name (e.g., `mouad.dev` or a subdomain like `mail.mouad.dev`).
   - Select your region (e.g., US or EU).

2. **Add DNS Records**:
   - Resend will provide DNS records:
     - **SPF** (TXT record)
     - **DKIM** (TXT/CNAME record)
     - **MX** record (for receiving bounce notifications)
   - Add these records in your DNS provider (Cloudflare, Namecheap, GoDaddy, Vercel DNS, etc.).

3. **Verify**:
   - Return to Resend and click **Verify DNS Records**.
   - Verification usually takes a few minutes (up to 24 hours depending on DNS propagation).

4. **Update `/api/send.js`**:
   - Once verified, update the `from` field in `api/send.js`:
     ```javascript
     from: 'Mouad.Dev <contact@mouad.dev>',
     ```
   - Commit and push to `main`.
