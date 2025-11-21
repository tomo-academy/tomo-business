# Email Notifications Setup for All Auth Methods

## Current Status
- ✅ Email signup: Sends confirmation email (working)
- ❌ Google OAuth: No email notification (needs setup)
- ❌ GitHub OAuth: No email notification (needs setup)

## Solution: Supabase Auth Webhooks

Supabase doesn't send custom emails for OAuth logins by default. You need to set up **Auth Webhooks** to trigger email notifications.

### Step 1: Enable Auth Webhooks in Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Hooks**
2. Enable the **"User Created"** hook
3. Add webhook URL: `https://tomo-business.vercel.app/api/auth-webhook`

### Step 2: Create Webhook Handler (Already Done)

The webhook handler at `/api/auth-webhook.js` will:
- Receive user creation events from Supabase
- Check the auth provider (google, github, email)
- Send custom welcome email via your email service

### Step 3: Set Up Email Service

Choose one of these email services:

#### Option A: Resend (Recommended - Easiest)
```bash
npm install resend
```

1. Sign up at https://resend.com
2. Add domain verification
3. Get API key
4. Add to Vercel: `RESEND_API_KEY=re_xxxxx`

#### Option B: SendGrid
```bash
npm install @sendgrid/mail
```

1. Sign up at https://sendgrid.com
2. Get API key
3. Add to Vercel: `SENDGRID_API_KEY=SG.xxxxx`

#### Option C: Nodemailer (Gmail)
```bash
npm install nodemailer
```

Add to Vercel:
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASS=your-app-password`

### Step 4: Configure Auth Hook in Supabase

Go to **Supabase Dashboard** → **Authentication** → **Hooks** → **Send Hook**:

**Webhook URL:**
```
https://tomo-business.vercel.app/api/auth-webhook
```

**Events:**
- ✅ `user.created` (for new signups)
- ✅ `user.signin` (optional - for login notifications)

**Secret:** (for verifying requests)
```
Generate a random secret and add to Vercel as: SUPABASE_WEBHOOK_SECRET
```

### Step 5: Test

1. Sign up with Google
2. Check that webhook receives the event
3. Verify email is sent
4. Check user's inbox

## Email Templates

Welcome emails will include:
- User name/email
- Login method (Google/GitHub/Email)
- Quick start guide
- Dashboard link
- Support contact

## Security

The webhook verifies:
- Request signature (using SUPABASE_WEBHOOK_SECRET)
- Origin headers
- Valid JSON payload

## Monitoring

Check logs in:
- Vercel → Your Project → Functions → `/api/auth-webhook`
- Supabase → Authentication → Hooks → View Logs
