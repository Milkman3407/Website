# 3D Print Request Portal

A static site for browsing printable models, adding items to a cart, and submitting print requests through Formspree.

## Features

- Displays available printable models.
- Stores cart selections in the browser.
- Lets users review and remove cart items before submitting a request.
- Sends checkout requests to the Formspree endpoint configured in `checkout.js`.
- Restricts requester emails to `@empireaccess.com` addresses.

## Checkout submissions

Checkout requests are sent to Formspree from the browser using the endpoint in `REQUEST_ENDPOINT` in `checkout.js`.

Each submission includes the requester name, requester email, work location, a readable message summary, and the cart line items as JSON.

## Customize models

Edit `PRODUCTS` in `products.js` to update model names, descriptions, units, lead times, and card colors.
