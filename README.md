# 3D Print Request Portal

A static site for browsing printable models, adding items to a cart, and submitting print requests through Formspree.

## Features

- Displays available printable models.
- Stores cart selections in the browser.
- Lets users review and remove cart items before submitting a request.
- Sends checkout requests to the Formspree endpoint configured in `checkout.js`.
- Collects requester email addresses for internal follow-up.

## Checkout submissions

Checkout requests are sent to Formspree from the browser using the endpoint in `REQUEST_ENDPOINT` in `checkout.js`.

Each submission includes the requester name, requester email, work location, and a readable message summary with the requested cart items.

## Email validation

Do not put company-domain validation in `checkout.html` or `checkout.js`; browser-side rules are visible in developer tools and can be bypassed. Keep the page limited to standard email-format validation, then configure the approved-domain rule in the Formspree dashboard so delivery is controlled server-side.

Recommended Formspree setup:

1. Add a default delivery rule for valid submissions.
2. Add a rule on the `email` field that handles submissions that do not match the approved company domain.
3. Use a neutral visitor-facing error or spam handling path so the approved domain is not disclosed by the browser code.

## Customize models

Edit `PRODUCTS` in `products.js` to update model names, descriptions, units, lead times, and card colors.
