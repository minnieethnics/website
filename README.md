# Minnie Ethnics — Setup Guide

## Prerequisites (install these first)
- Node.js: https://nodejs.org  (click LTS, install, next next next)
- VS Code: https://code.visualstudio.com
- Git: https://git-scm.com

---

## Step 1 — Run the project locally

```bash
# Open terminal (Mac: Cmd+Space → Terminal, Windows: Win+R → cmd)

cd minnie-ethnics
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000 — you should see the site.
The site works without Supabase or Razorpay for browsing (uses placeholder data).

---

## Step 2 — Set up Supabase (free database)

1. Go to https://supabase.com → Sign up → New Project
2. Choose a name (e.g. minnie-ethnics), set a strong password, pick Mumbai region
3. Wait ~2 minutes for project to spin up
4. Go to **SQL Editor** → **New Query**
5. Run migration SQL in Supabase SQL editor:
  - `supabase/migrations/20260328_001_initial_schema.sql` (recommended)
  - or copy `supabase-schema.sql` as a one-shot bootstrap
6. Go to **Project Settings → API**
7. Copy:
   - Project URL → paste as `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - anon/public key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → paste as `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 3 — Set up Razorpay (free, pay per transaction ~2%)

1. Go to https://razorpay.com → Sign Up (use your business details)
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy Key ID → paste as `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
4. Copy Key Secret → paste as `RAZORPAY_KEY_SECRET`
5. To accept real payments: complete KYC in Razorpay dashboard → switch to Live keys

---

## Step 4 — Set admin password

In `.env.local`, set:
```
ADMIN_PASSWORD=choose-anything-you-want
```

Visit http://localhost:3000/admin to test it.

---

## Step 5 — Deploy to Vercel (free)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow the prompts. When asked about environment variables, add each one from your `.env.local`.

OR use the Vercel dashboard:
1. Push code to GitHub first
2. Go to https://vercel.com → New Project → Import from GitHub
3. Add all env variables in Project Settings → Environment Variables
4. Deploy

---

## Step 6 — Point GoDaddy domain to Vercel

1. In Vercel: Project → Settings → Domains → Add `minnieethnics.com`
2. Vercel gives you two DNS records (A record + CNAME)
3. In GoDaddy: DNS → Manage → delete existing A record → add Vercel's records
4. Wait 10–30 minutes → site is live at minnieethnics.com

---

## Adding your first product

1. Go to /admin (enter your password)
2. Click Products → + Add Product
3. Upload photos (stored in Supabase bucket `product-images`), fill in name/price/age/gender
4. Click Publish — it appears on the site immediately

---

## File structure

```
src/
  app/
    page.tsx              ← Home page
    shop/page.tsx         ← Shop/catalogue
    product/[slug]/       ← Individual product
    cart/page.tsx         ← Checkout
    our-story/page.tsx    ← Our Story
    order-success/        ← Post-payment thank you
    admin/                ← Admin panel (password protected)
      page.tsx            ← Dashboard
      products/           ← Product management + image uploads
      orders/             ← View orders
      banners/            ← Edit hero banner
      themes/             ← Festival themes
      discounts/          ← Discount banner
    api/
      create-order/       ← Creates Razorpay order
      verify-payment/     ← Verifies payment
      admin-auth/         ← Admin login
      admin/products/     ← Create/update/delete product (admin cookie auth)
      admin/upload/       ← Upload product images to Supabase storage
      admin/site-settings/← Save banners/themes/discount settings

  components/
    ui/ThreadCanvas.tsx   ← Animated threads background
    layout/Navbar.tsx     ← Navigation
    layout/Footer.tsx     ← Footer
    layout/AdminSidebar.tsx
    layout/AdminAuthGuard.tsx
    home/HeroSection.tsx  ← Hero with video slot
    home/MarqueeBar.tsx   ← Scrolling text band
    home/ProductsSection.tsx ← Grid with filters
    home/OurStoryStrip.tsx
    home/ValuesSection.tsx
    shop/CartDrawer.tsx   ← Slide-in cart
    shop/ProductDetail.tsx

  lib/
    supabase.ts           ← DB client + types
    cart.ts               ← Cart state (Zustand)
    themes.ts             ← Festival theme definitions

  hooks/
    useSiteSettings.ts    ← Loads live settings from DB
```

---

## Add your video

Replace the placeholder in `src/components/home/HeroSection.tsx`:
Find the comment `VIDEO: When you have a stock video` and uncomment that block.
Put your video file at `public/videos/hero.mp4`

Free stock video sources:
- https://www.pexels.com/search/videos/indian%20children/
- https://pixabay.com/videos/search/ethnic%20wear/

---

## Add your founder photo

Put your photo at `public/images/founder.jpg`
Then in `src/components/home/OurStoryStrip.tsx` and `src/app/our-story/page.tsx`,
find the placeholder comment and uncomment the `<Image>` tag.

---

## Write your story

Open `src/app/our-story/page.tsx` — find the paragraph text and replace the
placeholder copy with your real story. Replace `[Your Name]` with your name.
