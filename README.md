# Empire Access 3D Print Request Portal

This is a static website starter you can host on GitHub Pages for internal 3D print requests.

## What it does

- Shows a list of printable models.
- Lets technicians add one or more items to a cart.
- Lets technicians specify:
  - Name
  - Company email
  - Area/Town/City
- On checkout, prepares an email to `alexander.fervan@empireaccess.com` with the order details.

## Important GitHub Pages note

GitHub Pages is static hosting, so it cannot send emails by itself.

This starter uses `mailto:` (opens the user's email app). For reliable email delivery, connect the checkout to one of these:

1. **Formspree / Basin / Getform** (fastest, no backend code)
2. **Serverless function** (e.g., Cloudflare Workers / Netlify Functions / Vercel)
3. **GitHub Actions flow** (submit to an issue or JSON endpoint, then email via action)

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set source to **Deploy from a branch**.
4. Choose your default branch and root folder.
5. Save and wait for the Pages URL.

## Customize models

Edit `products` in `script.js` to add your real model names and descriptions.
