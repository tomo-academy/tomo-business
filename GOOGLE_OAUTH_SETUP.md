# Google OAuth Setup Guide for Supabase

## Step 1: Configure Google OAuth in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to expand

## Step 2: Enable Google Provider

1. Toggle **Enable Sign in with Google** to ON
2. You'll need to configure:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

## Step 3: Get Google OAuth Credentials

### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**

### Create OAuth 2.0 Client ID

1. Click **Create Credentials** → **OAuth client ID**
2. If prompted, configure **OAuth consent screen** first:
   - Choose **External** user type
   - Fill in required fields:
     - App name: **TOMO BUSINESS**
     - User support email: your email
     - Developer contact: your email
   - Add scopes (optional but recommended):
     - `userinfo.email`
     - `userinfo.profile`
   - Add test users if needed
   - Save and continue

3. Back to **Create OAuth client ID**:
   - Application type: **Web application**
   - Name: **TOMO Business - Supabase Auth**
   
4. **Authorized JavaScript origins**:
   ```
   https://veknxixlfrojeujvxsbf.supabase.co
   http://localhost:5173
   ```

5. **Authorized redirect URIs**:
   ```
   https://veknxixlfrojeujvxsbf.supabase.co/auth/v1/callback
   http://localhost:5173/auth/v1/callback
   ```
   
   **IMPORTANT**: Replace `veknxixlfrojeujvxsbf` with your actual Supabase project ID

6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

## Step 4: Configure Supabase with Google Credentials

1. Go back to Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste the **Client ID** from Google
3. Paste the **Client Secret** from Google
4. Set **Authorized Client IDs** (optional)
5. Click **Save**

## Step 5: Update Site URL in Supabase

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to:
   ```
   https://tomo-business.vercel.app
   ```
   Or your custom domain

3. Add **Redirect URLs**:
   ```
   https://tomo-business.vercel.app/#/dashboard
   http://localhost:5173/#/dashboard
   ```

## Step 6: Test Google OAuth

1. Go to your auth page: `https://tomo-business.vercel.app/#/auth`
2. Click **Continue with Google**
3. Select your Google account
4. You should be redirected to `/dashboard` after successful authentication

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Double-check the redirect URI in Google Cloud Console matches exactly:
  `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`

### Error: "Access blocked: This app's request is invalid"
- Make sure you've configured the OAuth consent screen
- Add test users if your app is in testing mode
- Check that required scopes are added

### Error: "OAuth provider not configured"
- Verify Google provider is enabled in Supabase
- Check that Client ID and Secret are correctly entered
- Wait a few minutes for configuration to propagate

### OAuth works locally but not in production
- Add production URL to Google Cloud Console authorized origins
- Add production redirect URI to Google Cloud Console
- Update Site URL in Supabase to production URL

## Your Current Supabase Project

**Project ID**: veknxixlfrojeujvxsbf
**Project URL**: https://veknxixlfrojeujvxsbf.supabase.co

**Required Redirect URI for Google**:
```
https://veknxixlfrojeujvxsbf.supabase.co/auth/v1/callback
```

## Additional Notes

- Google OAuth requires HTTPS in production (Vercel provides this automatically)
- Users will see your app name and logo on the Google consent screen
- You can customize the consent screen in Google Cloud Console
- Consider adding your app logo and privacy policy URL to the consent screen
