# KushSavvy — Deployment Guide

## Step 1: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from the project root)
cd KUSHSAVVYDOTCOM
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? kushsavvy
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Option B: GitHub Integration
1. Push the repo to GitHub
2. Go to https://vercel.com/new
3. Import the GitHub repository
4. Vercel auto-detects Next.js — click Deploy


## Step 2: Set Up Environment Variables on Vercel

Go to your Vercel project → Settings → Environment Variables and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Claude API key — Tier 2 AI (COA analysis, AI parser) |
| `OPENAI_API_KEY` | `sk-...` | OpenAI key — Tier 1 AI (strain insights, 90% of calls) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | (from Step 3) | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Default dataset |
| `SANITY_API_TOKEN` | (from Step 3) | Sanity API token with write access |
| `NEXT_PUBLIC_SITE_URL` | `https://kushsavvy.com` | Your domain |
| `RESEND_API_KEY` | (from Step 4) | Resend API key |
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | Redis for rate limiting + insight cache |
| `UPSTASH_REDIS_REST_TOKEN` | `AX...` | Redis token |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | (from Cloudflare) | Optional: CAPTCHA for site tools |
| `TURNSTILE_SECRET_KEY` | (from Cloudflare) | Optional: CAPTCHA verification |

After adding all variables, **redeploy** for them to take effect:
```bash
vercel --prod
```


## Step 3: Set Up Sanity CMS (Free Tier)

### Create a Sanity Project
1. Go to https://www.sanity.io/ and sign up (free)
2. Create a new project named "KushSavvy"
3. Note your **Project ID** (looks like `a1b2c3d4`)
4. Go to https://www.sanity.io/manage → Your project → API → Tokens
5. Create a token with "Editor" permissions
6. Add both values to Vercel env vars

### Install Sanity Studio (Optional — for content management UI)
```bash
# In a separate directory
npm create sanity@latest -- --project YOUR_PROJECT_ID --dataset production

# Or add a studio to the existing project later
```

The site works WITHOUT Sanity connected — all seed data is built into
the codebase. Sanity is for future content management (adding new strains,
articles, updating state laws).


## Step 4: Set Up Resend for Email (Free Tier)

1. Go to https://resend.com and sign up (free — 100 emails/day)
2. Add and verify your domain (kushsavvy.com)
3. Go to API Keys → Create API Key
4. Add the key to Vercel env vars as `RESEND_API_KEY`

Without Resend configured, newsletter signups will still return success
but won't send welcome emails.


## Step 5: Connect Your Custom Domain

### On Vercel:
1. Go to your Vercel project → Settings → Domains
2. Add `kushsavvy.com` and `www.kushsavvy.com`
3. Vercel will show you the DNS records to configure

### On Your Domain Registrar:
Add these DNS records (Vercel will tell you the exact values):

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### If Using Cloudflare (Recommended for CDN):
1. Transfer your domain's nameservers to Cloudflare
2. In Cloudflare DNS, add the records above
3. Set SSL mode to "Full (strict)"
4. Enable "Always Use HTTPS"


## Step 6: Set Up Analytics (Optional)

### Google Analytics 4
1. Create a GA4 property at https://analytics.google.com
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add as `NEXT_PUBLIC_GA_ID` env var on Vercel

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property → URL prefix → https://kushsavvy.com
3. Verify via DNS TXT record
4. Submit your sitemap: https://kushsavvy.com/sitemap.xml

### PostHog (Optional)
1. Sign up at https://posthog.com (free tier: 1M events/month)
2. Get your project API key
3. Add as `NEXT_PUBLIC_POSTHOG_KEY` env var on Vercel


## Quick Verification Checklist

After deployment, verify these work:
- [ ] Homepage loads at kushsavvy.com
- [ ] Strain Recommender quiz completes and returns results
- [ ] Edible Dosage Calculator produces results
- [ ] Is It Legal shows state data when selected
- [ ] Strain pages load (e.g., /strains/blue-dream)
- [ ] Legal pages load (e.g., /legal/california)
- [ ] Newsletter signup form submits
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt accessible at /robots.txt

## Extension API Endpoints

These endpoints serve the Chrome extension (no CORS restrictions needed — extension makes same-origin requests to KushSavvy.com):

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/extension/insights` | POST | Main AI insight endpoint — GPT-4o Mini (Tier 1) |
| `/api/extension/coa` | POST | COA analysis — Claude Sonnet (Tier 2) |
| `/api/extension/affiliates` | GET | Affiliate link generation — no AI |

## Extension Build (Chrome Web Store)

The Chrome extension source lives in `/extension/`. To build:

```bash
cd extension
npm install
npm run build
# Output in extension/dist/ — upload as .zip to Chrome Web Store
```

See `/extension/manifest.json` for full permission declarations.
