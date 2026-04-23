# Empire Access 3D Print Request Portal

This is a static website starter you can host on GitHub Pages for internal 3D print requests.

## What it does

- Shows a list of printable models.
- Lets technicians add one or more items to a cart.
- Lets technicians specify:
  - Name
  - Company email
  - Area/Town/City
- Sends checkout requests directly to a Formspree endpoint from the browser (no `mailto:` client popup).

## Setup direct request sending

1. Create a form in Formspree and copy your endpoint URL (example: `https://formspree.io/f/abcxyz12`).
2. Open `script.js` and replace:
   - `https://formspree.io/f/YOUR_FORM_ID`
   with your real endpoint.
3. Deploy the site.

When submitted, the request body includes technician details plus cart line items as JSON.

## Important GitHub Pages note

GitHub Pages is static hosting, so it cannot send emails by itself without an external service.

This starter uses a hosted form endpoint (Formspree). Other options are:

1. **Basin / Getform**
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
