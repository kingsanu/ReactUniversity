# Stripe Frontend Integration Guide

This guide provides step-by-step instructions for integrating Stripe payments into your React frontend application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Payment Components](#payment-components)
- [Backend Integration](#backend-integration)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Testing](#testing)

## Prerequisites

- React application set up
- Backend API running (your .NET API with StripeController)
- Stripe account with API keys

## Installation

### 1. Install Stripe.js

```bash
npm install @stripe/stripe-js
```

### 2. Install additional dependencies (if needed)

```bash
npm install react-router-dom
```

## Environment Setup

### 1. Create Environment Variables

Create a `.env` file in your React project root:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
REACT_APP_API_BASE_URL=https://university-hjevd3cgbwgydzf2.canadacentral-01.azurewebsites.net
```

### 2. Get Your Stripe Keys

1. Log into your Stripe Dashboard
2. Go to Developers → API Keys
3. Copy your Publishable Key (starts with `pk_test_` or `pk_live_`)

## Payment Components

### 1. Basic Stripe Payment Component

```jsx
// components/StripePayment.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ amount, userId, description, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get Stripe config
      const configResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/stripe/config`
      );
      const config = await configResponse.json();

      // Step 2: Create payment intent
      const paymentIntentResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/stripe/create-payload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            amount: amount, // Amount in cents (e.g., 2000 = $20.00)
            currency: "usd",
            description: description,
          }),
        }
      );

      const paymentIntent = await paymentIntentResponse.json();

      if (!paymentIntent.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Step 3: Load Stripe and redirect to payment page
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({
        mode: "payment",
        lineItems: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: description,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-cancelled`,
      });

      if (error) {
        setError(error.message);
        onError?.(error.message);
      }
    } catch (err) {
      setError(err.message);
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-payment">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="payment-button"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default StripePayment;
```

### 2. Stripe Checkout Component (Recommended)

```jsx
// components/StripeCheckout.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = ({
  amount,
  userId,
  description,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Create payment intent
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/stripe/create-payload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            amount: amount,
            currency: "usd",
            description: description,
          }),
        }
      );

      const { clientSecret } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret, // This should be a session ID from your backend
      });

      if (error) {
        console.error("Error:", error);
        onError?.(error.message);
      }
    } catch (err) {
      console.error("Payment error:", err);
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-checkout">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="checkout-button"
      >
        {loading ? "Loading..." : "Pay with Stripe"}
      </button>
    </div>
  );
};

export default StripeCheckout;
```

### 3. Payment Success Page

```jsx
// pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // Verify payment with your backend
      fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/stripe/status/${sessionId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "succeeded") {
            setStatus("success");
            setPaymentDetails(data);
          } else {
            setStatus("failed");
          }
        })
        .catch((err) => {
          setStatus("error");
          console.error("Payment verification error:", err);
        });
    }
  }, [searchParams]);

  const handleContinue = () => {
    navigate("/dashboard"); // Redirect to your main app
  };

  return (
    <div className="payment-success">
      <div className="success-container">
        {status === "loading" && (
          <div>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <h2>Payment Successful! 🎉</h2>
            <p>Thank you for your payment.</p>
            {paymentDetails && (
              <div className="payment-details">
                <p>
                  <strong>Amount:</strong> $
                  {(paymentDetails.amount / 100).toFixed(2)}
                </p>
                <p>
                  <strong>Description:</strong> {paymentDetails.description}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(paymentDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
            <button onClick={handleContinue} className="continue-button">
              Continue to Dashboard
            </button>
          </div>
        )}

        {status === "failed" && (
          <div>
            <h2>Payment Failed</h2>
            <p>There was an issue with your payment. Please try again.</p>
            <button
              onClick={() => navigate("/payment")}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2>Verification Error</h2>
            <p>Unable to verify payment status. Please contact support.</p>
            <button onClick={handleContinue} className="continue-button">
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
```

### 4. Payment Cancelled Page

```jsx
// pages/PaymentCancelled.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-cancelled">
      <div className="cancelled-container">
        <h2>Payment Cancelled</h2>
        <p>Your payment was cancelled. You can try again anytime.</p>
        <div className="action-buttons">
          <button onClick={() => navigate("/payment")} className="retry-button">
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="back-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
```

## Backend Integration

### 1. Update StripeController (Optional Enhancement)

Add this method to your existing `StripeController.cs` for better Checkout Session support:

```csharp
[HttpPost("create-checkout-session")]
public async Task<ActionResult> CreateCheckoutSession([FromBody] CreatePaymentIntentRequest request)
{
    try
    {
        var user = await DB.Find<User>().OneAsync(request.UserId);
        if (user == null)
        {
            return BadRequest(new { error = "User not found" });
        }

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = request.Currency,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = request.Description ?? "Payment",
                        },
                        UnitAmount = request.Amount,
                    },
                    Quantity = 1,
                },
            },
            Mode = "payment",
            SuccessUrl = "https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = "https://yourdomain.com/cancel",
            Metadata = new Dictionary<string, string>
            {
                { "userId", request.UserId }
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return Ok(new { sessionId = session.Id });
    }
    catch (StripeException ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}
```

## Usage Examples

### 1. Basic Usage

```jsx
// App.jsx or your main component
import StripePayment from "./components/StripePayment";

function App() {
  const handlePaymentSuccess = () => {
    console.log("Payment successful!");
    // Handle success logic
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    // Handle error logic
  };

  return (
    <div>
      <h1>Resume Builder Premium</h1>
      <StripePayment
        amount={2000} // $20.00 in cents
        userId="user123"
        description="Resume Builder Premium Plan"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
```

### 2. With React Router

```jsx
// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StripePayment from "./components/StripePayment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
      </Routes>
    </Router>
  );
}

function PaymentPage() {
  return (
    <div>
      <h1>Complete Your Purchase</h1>
      <StripePayment
        amount={5000} // $50.00
        userId="user123"
        description="Resume Builder Pro Plan"
      />
    </div>
  );
}
```

## Error Handling

### 1. Network Errors

```jsx
const handlePayment = async () => {
  try {
    // Payment logic
  } catch (err) {
    if (err.name === "NetworkError") {
      setError("Network error. Please check your connection.");
    } else {
      setError("Payment failed. Please try again.");
    }
  }
};
```

### 2. Stripe Errors

```jsx
const handleStripeError = (error) => {
  switch (error.type) {
    case "card_error":
      setError(`Card error: ${error.message}`);
      break;
    case "validation_error":
      setError(`Validation error: ${error.message}`);
      break;
    default:
      setError("An unexpected error occurred.");
  }
};
```

## Testing

### 1. Test Card Numbers

Use these test card numbers in development:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

### 2. Test Environment Variables

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123DEF456GHI789JKL
REACT_APP_API_BASE_URL=http://localhost:5149
```

### 3. Testing Checklist

- [ ] Payment intent creation works
- [ ] Stripe Checkout opens correctly
- [ ] Success page displays payment details
- [ ] Cancel page handles cancellation
- [ ] Error handling works for various scenarios
- [ ] Payment verification works on success page

## Security Considerations

1. **Never expose your secret key** in frontend code
2. **Always verify payments** on your backend
3. **Use HTTPS** in production
4. **Validate user permissions** before creating payments
5. **Log payment events** for audit trails

## Production Checklist

- [ ] Update to live Stripe keys
- [ ] Set up webhook endpoints
- [ ] Configure proper success/cancel URLs
- [ ] Test with real payment methods
- [ ] Set up error monitoring
- [ ] Implement proper logging
- [ ] Add analytics tracking

## Support

For issues with this integration:

1. Check Stripe's official documentation
2. Verify your API keys are correct
3. Ensure your backend is running and accessible
4. Check browser console for JavaScript errors
5. Verify CORS settings on your backend

---

**Note:** This integration assumes your backend API is running on `http://localhost:5149`. Adjust the URLs according to your actual backend configuration.
