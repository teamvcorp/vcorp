# Stripe Payment Setup Guide

## ✅ Completed Steps

### 1. Environment Variables Added
- ✅ `STRIPE_WEBHOOK_SECRET` - Already configured
- ✅ `CRON_SECRET` - Added for auto-charge endpoint security

### 2. Stripe Webhook Configuration

**Required Webhook Events:**
- `payment_intent.succeeded` - When payment completes (adds Magic Points)
- `payment_intent.payment_failed` - When payment fails
- `setup_intent.succeeded` - When card setup completes (optional)

**Setup Instructions:**

#### For Production:
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://yourdomain.com/api/stripe-webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `setup_intent.succeeded`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Update production environment variable `STRIPE_WEBHOOK_SECRET`

#### For Local Testing:
Use Stripe CLI to forward webhooks to localhost:
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Test webhook
stripe trigger payment_intent.succeeded
```

The CLI will provide a webhook signing secret (e.g., `whsec_test_...`) - already configured in `.env.local`

### 3. Cron Job for Recurring Billing

**Endpoint:** `POST /api/spiritof/auto-charge`

**Authorization:** Requires `Authorization: Bearer <CRON_SECRET>` header

**Purpose:** Automatically charges parents who have auto-bill enabled and are due for payment

**Setup Options:**

#### Option A: Vercel Cron (Recommended for Vercel deployments)
Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/spiritof/auto-charge",
      "schedule": "0 3 * * *"
    }
  ]
}
```
This runs daily at 3 AM UTC. Add `CRON_SECRET` to Vercel environment variables.

#### Option B: GitHub Actions
Create `.github/workflows/auto-charge.yml`:
```yaml
name: SpiritOf Auto-Charge
on:
  schedule:
    - cron: '0 3 * * *'  # Daily at 3 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  auto-charge:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Auto-Charge
        run: |
          curl -X POST https://yourdomain.com/api/spiritof/auto-charge \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```
Add `CRON_SECRET` to GitHub repository secrets.

#### Option C: External Cron Service
Use services like:
- [Cron-job.org](https://cron-job.org/)
- [EasyCron](https://www.easycron.com/)
- [Pipedream](https://pipedream.com/)

Configure to POST to `https://yourdomain.com/api/spiritof/auto-charge` with header:
```
Authorization: Bearer <CRON_SECRET>
```

### 4. Testing the Payment Flow

#### Test the Complete Onboarding Flow:
1. Start dev server: `npm run dev`
2. Sign in from external site (e.g., http://localhost:3001)
3. Click magic link in email
4. Should redirect to enrollment dashboard
5. Click "Start Onboarding" for spiritof
6. Fill out 4-step form:
   - **Step 1:** Payment info (use Stripe test card: `4242 4242 4242 4242`, any future date, any CVC)
   - **Step 2:** Billing address
   - **Step 3:** Add children with budgets
   - **Step 4:** Enable auto-bill (optional)
7. Complete onboarding
8. Check database:
   - User's `programs` array should include spiritof
   - `spiritof_parents` collection should have new record
   - `spiritof_children` collection should have child records
   - If auto-bill enabled, initial charge should be processed

#### Test Manual Charge:
```bash
curl -X POST http://localhost:3000/api/spiritof/charge \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "amount": 50.00,
    "description": "Test charge"
  }'
```

#### Test Webhook:
```bash
# Using Stripe CLI
stripe trigger payment_intent.succeeded
```

#### Test Auto-Charge Cron:
```bash
curl -X POST http://localhost:3000/api/spiritof/auto-charge \
  -H "Authorization: Bearer a7f3e9d2c5b8a1f4e6d9c2b5a8f1e4d7c0b3a6f9e2d5c8b1a4f7e0d3c6b9a2f5" \
  -H "Content-Type: application/json"
```

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/spiritof/onboard` | POST | Complete onboarding with payment setup |
| `/api/spiritof/setup-payment` | POST | Add/update payment method |
| `/api/spiritof/charge` | POST | Manual charge (add funds) |
| `/api/spiritof/auto-charge` | POST | Cron endpoint for recurring billing |
| `/api/stripe-webhook` | POST | Stripe webhook handler |

## Magic Points Conversion
- **$1.00 = 100 Magic Points**
- All charges automatically converted to Magic Points
- Balance stored in `spiritof_parents.balance.current`
- Used for activities on Santa site (separate codebase)

## Security Checklist
- ✅ Stripe API keys secured in environment variables
- ✅ Webhook signature verification enabled
- ✅ Cron endpoint protected with bearer token
- ✅ Payment methods attached to Stripe customers
- ✅ Sensitive console.logs removed from production code
- ⚠️ Remove `/api/debug/clear-programs` before production

## Next Steps for Production
1. [ ] Configure Stripe webhook in production dashboard
2. [ ] Set up cron job (Vercel/GitHub Actions/external)
3. [ ] Add all environment variables to production
4. [ ] Test payment flow end-to-end
5. [ ] Monitor webhook deliveries in Stripe dashboard
6. [ ] Set up Stripe fraud detection rules
7. [ ] Configure email notifications for failed payments
8. [ ] Remove debug endpoints
9. [ ] Add error monitoring (e.g., Sentry)
10. [ ] Document refund/dispute processes
