# Backend Stripe Integration Requirements

## 🎯 Current Issue

The frontend is trying to integrate with Stripe Checkout but getting the error:
```
Invalid stripe.redirectToCheckout parameter: lineItems.0.price_data is not an accepted parameter.
```

This happens because `stripe.redirectToCheckout()` requires a **Checkout Session ID** created on the backend, not client-side line items.

## ✅ Required Backend Implementation

### Option 1: Create Dedicated Checkout Session Endpoint (Recommended)

Create a new endpoint: `POST /api/stripe/create-checkout-session`

**Request Body:**
```json
{
  "userId": "string",
  "amount": 2900,
  "currency": "usd", 
  "description": "Monthly Subscription - Complete access to the platform",
  "billingOptionId": "monthly",
  "successUrl": "https://yourapp.com/dashboard/subscriptions?success=true&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://yourapp.com/dashboard/subscriptions?cancelled=true"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Backend Implementation (Node.js example):**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { userId, amount, currency, description, successUrl, cancelUrl } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        description: description
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Option 2: Modify Existing Endpoints

If you prefer to use existing endpoints, modify them to return checkout session information:

**Modify `POST /api/stripe/create-payload`** to return:
```json
{
  "paymentIntentId": "pi_...",
  "clientSecret": "pi_..._secret_...",
  "sessionId": "cs_test_...",  // ADD THIS
  "amount": 2900,
  "currency": "usd",
  "status": "requires_payment_method"
}
```

**OR modify `POST /api/stripe/create-payment`** to return:
```json
{
  "success": true,
  "paymentIntentId": "pi_...",
  "status": "requires_action",
  "redirectUrl": "https://checkout.stripe.com/pay/cs_test_...",  // ADD THIS
  "message": "Redirect to Stripe Checkout"
}
```

## 🔧 Frontend Integration

The frontend is already set up to handle multiple approaches:

1. **Looks for `sessionId`** in API responses
2. **Looks for `redirectUrl`** in API responses  
3. **Provides detailed logging** to debug API responses
4. **Handles errors gracefully** with helpful messages

## 🧪 Testing the Integration

### Current Frontend Behavior:
1. User clicks subscription button
2. Frontend calls your API endpoints
3. Logs all API responses to browser console
4. Tries to extract `sessionId` or `redirectUrl`
5. Redirects to Stripe or shows error message

### To Test:
1. Go to `/dashboard/subscriptions`
2. Open browser developer tools (F12)
3. Click "Test Stripe" button to see current API responses
4. Click any subscription plan button
5. Check console logs to see what your API returns

## 📋 Stripe Checkout Session Benefits

### ✅ **Security**
- All payment data handled by Stripe
- PCI compliance automatic
- No sensitive data in frontend

### ✅ **User Experience**  
- Professional Stripe checkout interface
- Mobile optimized
- Supports all payment methods
- Automatic receipt emails

### ✅ **Features**
- Tax calculation
- Discount codes
- Multiple payment methods
- Subscription management
- Webhook support

## 🔗 Stripe Documentation

- [Checkout Sessions API](https://stripe.com/docs/api/checkout/sessions)
- [Accept Payments with Checkout](https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=checkout)
- [Checkout Session Integration](https://stripe.com/docs/payments/checkout/how-checkout-works)

## 🚨 Important Notes

1. **Use your Stripe Secret Key** on the backend (not the publishable key)
2. **Validate user authentication** before creating sessions
3. **Set up webhooks** to handle successful payments
4. **Store session metadata** to track which user/plan the payment is for
5. **Handle session expiration** (sessions expire after 24 hours)

## 💡 Quick Fix

If you want to get it working immediately, just add this to your existing `create-payment` endpoint:

```javascript
// After creating payment intent, also create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: description },
      unit_amount: amount,
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: returnUrl.replace('{CHECKOUT_SESSION_ID}', '{CHECKOUT_SESSION_ID}'),
  cancel_url: returnUrl.replace('success=true', 'cancelled=true'),
  client_reference_id: userId
});

// Return the redirect URL
return {
  success: true,
  paymentIntentId: paymentIntent.id,
  status: 'requires_action',
  redirectUrl: session.url  // Frontend will redirect here
};
```

This will make the payment integration work immediately! 🚀
