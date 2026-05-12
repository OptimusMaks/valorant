# AI Agent Handoff: Valorant Mobile

This document is the short context file to give to another AI agent before it works on this project.

## Project Summary

`valorant-mobile` is an Expo / React Native web-first landing page for a Valorant Mobile themed funnel.

Current user flow:

1. Landing screen with `PLAY NOW`.
2. `PLAY NOW` creates a ChargedPay checkout session and opens the hosted paywall URL returned by ChargedPay.
3. The app stays on the landing screen while the external paywall is open.
4. If the user returns via `success_url`, the app shows the account/email screen.
5. If the user returns via `failure_url`, the app shows the failure/retry screen.
6. After the user enters email on the account screen, `CONTINUE` shows the final local success screen.

The product/payment state is not stored in this app. For the current MVP, payment data is expected to live in the ChargedPay merchant dashboard.

## Important Scope Decisions

- Do not add a local database for this MVP.
- Do not add a webhook handler for this MVP.
- Do not poll `checkout_session` for payment status.
- Do not create a backend unless ChargedPay requires a secret `Authorization` / API key or direct browser requests fail due to CORS.
- Do not hardcode temporary staging domains in UI components.
- UI copy should be in English.
- Chat responses to the owner should be in Russian.

## Main Files

- `src/root/App.tsx` - app shell, safe area, fonts, viewport behavior.
- `src/screens/HomeScreen.tsx` - all main funnel screens and CTA behavior.
- `src/components/AccountEmailForm.tsx` - email form card.
- `src/config/payment.ts` - ChargedPay project config and redirect URL config.
- `src/services/chargedPay.ts` - ChargedPay API request and response parsing.
- `src/styles/colors.ts` - shared colors.
- `src/styles/fonts.ts` - shared font families and font loading.
- `docs/ai-agent-handoff.md` - this document.

## ChargedPay Integration

Base API:

```txt
https://chargedpay.com/api/v1
```

Main endpoint:

```txt
POST /api/v1/checkout/payment-boxes
```

Implemented request target:

```txt
https://chargedpay.com/api/v1/checkout/payment-boxes
```

Current IDs:

```txt
project_id: 1529f44f-5777-46ed-bd26-cac738cdaae2
payment_box_ids: a9b6def1-d7cc-4954-bb98-2e8ddbd38604
```

Current request body shape:

```json
{
  "project_id": "1529f44f-5777-46ed-bd26-cac738cdaae2",
  "payment_box_ids": ["a9b6def1-d7cc-4954-bb98-2e8ddbd38604"],
  "page": "pw",
  "return_url": "https://example.com/",
  "success_url": "https://example.com/#payment=success",
  "failure_url": "https://example.com/#payment=failure",
  "surface": "web",
  "email": "optional-user@example.com"
}
```

`email` is only sent when the app has one. Since checkout currently starts from the first screen, the first request can be sent without `email`.

Expected response shape:

```json
{
  "payment_boxes": [
    {
      "id": "payment-box-id",
      "products": [
        {
          "id": "product-id",
          "sortOrder": 0,
          "title": "Monthly Premium",
          "fullPrice": "$39.99",
          "fullPriceText": "Then, $39.99 every month",
          "promoPrice": "$1.00",
          "promoPriceText": "$1.00 first 5 days",
          "token": "checkout-session-token",
          "url": "https://64bit.games/newest-paywall?checkout_session=..."
        }
      ]
    }
  ]
}
```

The app sorts products by `sortOrder` and opens the first product with a valid `url`.

### Hosted Paywall URL

If the browser opens a URL like:

```txt
https://64bit.games/newest-paywall?checkout_session=...
```

that URL is coming from ChargedPay. It is not hardcoded in this app.

If a different/new product is needed, ask ChargedPay/Danil for updated `project_id` and/or `payment_box_ids`, or update the product/paywall configuration in the ChargedPay dashboard.

## Redirect Handling

Default redirect URLs are derived from the current web origin:

```txt
return_url:  <origin>/
success_url: <origin>/#payment=success
failure_url: <origin>/#payment=failure
```

The app recognizes both hash and path variants:

```txt
/#payment=success
/#payment=failure
/payment/success
/payment/failure
```

On native/mobile there is no `window.location.origin`, so production-like builds should provide explicit env values.

Current redirect behavior:

- `success_url` leads to the account/email screen, not directly to the final success screen.
- `failure_url` leads to the failure/retry screen.
- The final success screen is local and appears after the account/email step.

## Environment Variables

Supported public Expo env vars:

```txt
EXPO_PUBLIC_CHARGEDPAY_API_BASE_URL
EXPO_PUBLIC_PAYMENT_SITE_ORIGIN
EXPO_PUBLIC_PAYMENT_RETURN_URL
EXPO_PUBLIC_PAYMENT_SUCCESS_URL
EXPO_PUBLIC_PAYMENT_FAILURE_URL
```

Typical staging example for the current server:

```txt
EXPO_PUBLIC_PAYMENT_SITE_ORIGIN=http://144.31.109.4:8890
```

If `EXPO_PUBLIC_PAYMENT_SUCCESS_URL`, `EXPO_PUBLIC_PAYMENT_FAILURE_URL`, or `EXPO_PUBLIC_PAYMENT_RETURN_URL` are omitted, they are derived from `EXPO_PUBLIC_PAYMENT_SITE_ORIGIN`.

For production, prefer HTTPS and the final domain:

```txt
EXPO_PUBLIC_PAYMENT_SITE_ORIGIN=https://your-production-domain.example
```

## Server Deployment Notes

The current server note says Expo static apps are served with `serve` under PM2, similar to `injobs-web`.

Known current test site:

```txt
http://144.31.109.4:8890/
```

Build locally:

```bash
npx expo export -p web
```

Deploy `dist/` to the server, for example:

```bash
scp -r dist root@maksim03033:/root/valorant-mobile/
```

First-time PM2 serve command on the server:

```bash
npm i -g serve
pm2 start serve --name valorant-web -- -s /root/valorant-mobile/dist -l 8890
pm2 save
```

If already running:

```bash
pm2 restart valorant-web
pm2 logs valorant-web --lines 50
```

Open firewall port if needed:

```bash
ufw allow 8890/tcp
ufw status
```

## Local Development

Install dependencies:

```bash
npm ci
```

Run web dev server:

```bash
npm run web
```

Type check:

```bash
npx tsc --noEmit
```

Export web static build:

```bash
npx expo export -p web
```

## Testing Checklist

Do not click live checkout unless you intentionally want to create a ChargedPay checkout session.

Safe local checks:

```txt
http://localhost:8081/
http://localhost:8081/#payment=success
http://localhost:8081/#payment=failure
```

Expected:

- `/` shows the landing screen with `PLAY NOW`.
- `/#payment=success` shows the account/email screen.
- `/#payment=failure` shows failure state with `TRY AGAIN`.
- `npx tsc --noEmit` passes.

Live integration checks:

- `PLAY NOW` should call `POST /api/v1/checkout/payment-boxes`.
- Response should contain at least one `payment_boxes[].products[].url`.
- Browser should open the returned paywall URL.
- ChargedPay should redirect back to the configured `success_url` or `failure_url`.

## Current Caveats

- No backend proxy is implemented.
- No local subscription tracking is implemented.
- No webhook is implemented.
- No payment status polling is implemented.
- Direct browser fetch depends on ChargedPay allowing CORS and not requiring secret auth for `POST /checkout/payment-boxes`.
- If CORS/auth fails, add a minimal server proxy that forwards checkout creation requests without adding DB/webhook logic.
- `project_id` and `payment_box_ids` are currently in client code because the MVP assumes no secret auth requirement.

## What To Ask Before Changing Payment Logic

Ask the owner or ChargedPay contact for:

- Is `POST /api/v1/checkout/payment-boxes` public for browser/mobile clients?
- Are CORS requests from the deployed domain allowed?
- Is the current `payment_box_ids` value the new product or the old product?
- Should `surface` be `mobile` or `web` for the deployed web landing?
- Should the hosted paywall be `64bit.games/newest-paywall`, or is a new paywall URL expected?
- Are staging and production domains whitelisted for redirects?

