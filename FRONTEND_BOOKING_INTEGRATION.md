# Frontend Booking Integration Guide

This guide provides step-by-step instructions for integrating the booking service with Stripe payment processing into your frontend application.

## Table of Contents

- [Overview](#overview)
- [Payment-First Booking Flow](#payment-first-booking-flow)
- [Prerequisites](#prerequisites)
- [Integration Steps](#integration-steps)
- [API Endpoints](#api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)
- [Testing](#testing)

---

## Overview

The booking system requires **payment before booking confirmation**. The system supports **two payment flows**:

### Flow Option 1: PaymentIntent (Default - No Redirect)
1. User selects a coach and time slot
2. System creates a Stripe PaymentIntent (booking is NOT created yet)
3. User completes payment on YOUR frontend page using Stripe.js
4. Stripe webhook automatically creates the booking after successful payment
5. Frontend polls for booking status to confirm creation
6. **You handle redirect manually** to success page

### Flow Option 2: Checkout Session (With Redirect)
1. User selects a coach and time slot
2. System creates a Stripe Checkout Session (booking is NOT created yet)
3. User is **redirected to Stripe's hosted payment page**
4. User completes payment on Stripe's page
5. **Stripe redirects back to your successUrl** after payment
6. Stripe webhook automatically creates the booking
7. Frontend checks booking status on success page

---

## Payment-First Booking Flow

### PaymentIntent Flow (Default - No Redirect)

```
┌─────────────┐
│ User selects│
│ coach & slot│
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ POST /api/v1/bookings│
│ Creates PaymentIntent│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Returns ClientSecret│
│ & PaymentIntentId   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Process Payment     │
│ with Stripe.js      │
│ (ON YOUR PAGE)      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Payment Succeeds    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Webhook creates     │
│ booking automatically│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Poll booking status │
│ to confirm          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ MANUAL REDIRECT     │
│ to success page     │
└─────────────────────┘
```

### Checkout Session Flow (With Redirect)

```
┌─────────────┐
│ User selects│
│ coach & slot│
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ POST /api/v1/bookings│
│ (useCheckoutSession:│
│  true, successUrl,  │
│  cancelUrl)          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Returns SessionUrl  │
│ (Stripe checkout)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ REDIRECT TO STRIPE  │
│ window.location.href│
│ = sessionUrl        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ User pays on        │
│ Stripe's page       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ STRIPE REDIRECTS    │
│ to your successUrl  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Webhook creates     │
│ booking automatically│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Check booking status│
│ on success page     │
└─────────────────────┘
```

---

## Prerequisites

1. **Stripe Account**: You need a Stripe account (test or production)
2. **Stripe.js**: Install Stripe.js in your frontend project
   ```bash
   npm install @stripe/stripe-js
   ```
3. **API Base URL**: Know your backend API base URL
   - Production: `https://careerproject-eucbddf3h4h0ekfx.canadacentral-01.azurewebsites.net`
   - Local: `http://localhost:5000` (or your local port)
4. **Authentication Token**: User must be authenticated (JWT token)

---

## Integration Steps

### Step 1: Get Stripe Public Key

Before processing payments, retrieve the Stripe public key from your backend.

**Endpoint:** `GET /api/stripe/config`

**Response:**
```json
{
  "publicKey": "pk_test_51RdERE4J0voqn3kuS6tySM19jX0k5GxFKlmv2p2UvctILEtxI5w8pGZG56fkXav2iMLPuqjNAoxJZekBo0GQmjPg00WTyXzNp3"
}
```

### Step 2: Initialize Stripe

```javascript
import { loadStripe } from '@stripe/stripe-js';

// Get public key from your backend
const response = await fetch(`${API_BASE_URL}/api/stripe/config`);
const { publicKey } = await response.json();

// Initialize Stripe
const stripe = await loadStripe(publicKey);
```

### Step 3: Create Booking Request

When user clicks "Book Session", create a booking request which will return payment details.

### Step 4: Process Payment

Use Stripe.js to process the payment with the returned `clientSecret`.

### Step 5: Poll for Booking Status

After payment succeeds, poll the booking status endpoint to confirm the booking was created.

---

## API Endpoints

### 1. Get Stripe Configuration

**Endpoint:** `GET /api/stripe/config`

**Headers:** None required

**Response:**
```json
{
  "publicKey": "pk_test_..."
}
```

---

### 2. Book Session (Create Payment Intent)

**Endpoint:** `POST /api/v1/bookings`

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "coachId": "string (required)",
  "slot": {
    "start": "2024-12-25T14:00:00Z (required, ISO 8601)",
    "end": "2024-12-25T14:30:00Z (required, ISO 8601)"
  },
  "topic": "string (optional, max 200 chars)",
  "notes": "string (optional, max 1000 chars)",
  "useCheckoutSession": "boolean (optional, default: false)",
  "successUrl": "string (optional, required if useCheckoutSession=true)",
  "cancelUrl": "string (optional, required if useCheckoutSession=true)"
}
```

**Payment Flow Options:**

1. **PaymentIntent Flow (Default - No Redirect):**
   - Set `useCheckoutSession: false` or omit it
   - Payment happens on your frontend page
   - No redirect from Stripe
   - You handle success manually

2. **Checkout Session Flow (With Redirect):**
   - Set `useCheckoutSession: true`
   - Provide `successUrl` and `cancelUrl`
   - User is redirected to Stripe's hosted payment page
   - Stripe redirects back to your `successUrl` after payment

**Success Response (200) - PaymentIntent Flow:**
```json
{
  "success": true,
  "message": "Please complete payment to confirm your booking. Session will be booked automatically after successful payment.",
  "data": {
    "paymentIntentId": "pi_3ABC123xyz",
    "clientSecret": "pi_3ABC123xyz_secret_xyz",
    "paymentStatus": "requires_payment_method",
    "amount": 5000,
    "currency": "usd",
    "status": "pending_payment"
  },
  "method": "POST /api/v1/bookings"
}
```

**Success Response (200) - Checkout Session Flow:**
```json
{
  "success": true,
  "message": "Redirect to Stripe checkout page to complete payment. Booking will be created automatically after successful payment.",
  "data": {
    "paymentIntentId": "cs_test_abc123xyz",
    "clientSecret": "https://checkout.stripe.com/pay/cs_test_abc123xyz",
    "paymentStatus": "pending",
    "amount": 5000,
    "currency": "usd",
    "status": "pending_payment"
  },
  "method": "POST /api/v1/bookings"
}
```

**Note:** 
- **PaymentIntent Flow**: `clientSecret` is used with Stripe.js to process payment on your page
- **Checkout Session Flow**: `clientSecret` contains the session URL - redirect user to this URL

**Error Responses:**

**400 Bad Request - Invalid time slot:**
```json
{
  "success": false,
  "message": "Invalid time slot",
  "errorMessage": "Start time must be before end time",
  "method": "POST /api/v1/bookings"
}
```

**400 Bad Request - Coach pricing not set:**
```json
{
  "success": false,
  "message": "Coach pricing not set",
  "errorMessage": "Coach has not set their hourly rate. Please contact the coach.",
  "method": "POST /api/v1/bookings"
}
```

**400 Bad Request - Time slot unavailable:**
```json
{
  "success": false,
  "message": "Time slot unavailable",
  "errorMessage": "This time slot is already booked",
  "method": "POST /api/v1/bookings"
}
```

**404 Not Found - Coach not found:**
```json
{
  "success": false,
  "message": "Coach not found",
  "errorMessage": "Coach not found",
  "method": "POST /api/v1/bookings"
}
```

---

### 3. Check Booking Status by Payment Intent

**Endpoint:** `GET /api/stripe/booking-status/{paymentIntentId}`

**Headers:** None required

**Success Response (200):**
```json
{
  "paymentIntentId": "pi_3ABC123xyz",
  "paymentStatus": "succeeded",
  "bookingId": "507f1f77bcf86cd799439011",
  "bookingStatus": "confirmed",
  "bookingCreated": true,
  "amount": 5000,
  "currency": "usd"
}
```

**Response when booking not yet created:**
```json
{
  "paymentIntentId": "pi_3ABC123xyz",
  "paymentStatus": "succeeded",
  "bookingId": null,
  "bookingStatus": null,
  "bookingCreated": false,
  "amount": 5000,
  "currency": "usd"
}
```

**Note:** This endpoint has a fallback mechanism. If payment succeeded but webhook failed, it will attempt to create the booking automatically.

---

### 4. Get User Sessions

**Endpoint:** `GET /api/v1/bookings/me?status={status}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `status` (optional): `"upcoming"`, `"past"`, or `"all"` (default: `"all"`)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User sessions retrieved successfully",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439011",
        "coachId": "507f1f77bcf86cd799439012",
        "coachName": "John Coach",
        "coachImage": "https://example.com/image.jpg",
        "coachTitle": "Senior Career Coach",
        "studentName": "Jane Student",
        "studentImage": "",
        "topic": "Career Guidance",
        "notes": "Looking for help with career transition",
        "slot": {
          "start": "2024-12-25T14:00:00Z",
          "end": "2024-12-25T14:30:00Z"
        },
        "startTime": "2024-12-25T14:00:00Z",
        "endTime": "2024-12-25T14:30:00Z",
        "status": "confirmed",
        "meetingLink": "https://meet.google.com/abc-defg-hij",
        "isPaymentDone": true,
        "paidAt": "2024-12-20T10:30:00Z",
        "amount": 5000,
        "currency": "usd"
      }
    ]
  },
  "method": "GET /api/v1/bookings/me"
}
```

---

### 5. Get Coach Sessions

**Endpoint:** `GET /api/v1/coach/me/sessions?status={status}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `status` (optional): `"upcoming"`, `"past"`, or `"all"` (default: `"all"`)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sessions retrieved successfully",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439011",
        "studentName": "Jane Student",
        "studentImage": "",
        "topic": "Career Guidance",
        "startTime": "2024-12-25T14:00:00Z",
        "endTime": "2024-12-25T14:30:00Z",
        "status": "confirmed",
        "meetingLink": "https://meet.google.com/abc-defg-hij",
        "isPaymentDone": true,
        "paidAt": "2024-12-20T10:30:00Z",
        "amount": 5000,
        "currency": "usd"
      }
    ]
  },
  "method": "GET /api/v1/coach/me/sessions"
}
```

---

### 6. Get Available Booking Slots

**Endpoint:** `GET /api/v1/coach/{coachId}/slots?date={date}&timezone={timezone}`

**Headers:** None required

**Query Parameters:**
- `date` (required): Date in `YYYY-MM-DD` format (e.g., `"2024-12-25"`)
- `timezone` (optional): Timezone identifier (e.g., `"America/New_York"`, `"Asia/Kolkata"`)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Slots retrieved successfully",
  "data": {
    "date": "2024-12-25",
    "timezone": "America/New_York",
    "coachId": "507f1f77bcf86cd799439012",
    "sessionDurationMinutes": 30,
    "price": {
      "amount": 100.00,
      "currency": "USD"
    },
    "slots": [
      {
        "start": "2024-12-25T14:00:00Z",
        "end": "2024-12-25T14:30:00Z",
        "available": true
      },
      {
        "start": "2024-12-25T14:30:00Z",
        "end": "2024-12-25T15:00:00Z",
        "available": true
      }
    ],
    "nextAvailableDate": "2024-12-26"
  },
  "method": "GET /api/v1/coach/{coachId}/slots"
}
```

---

## Request/Response Examples

### Complete Booking Flow Examples

#### Option 1: PaymentIntent Flow (No Redirect - Payment on Your Page)

```javascript
// 1. Get Stripe public key
const getStripeConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/api/stripe/config`);
  return await response.json();
};

// 2. Create booking request (creates payment intent)
const createBookingRequest = async (bookingData, authToken) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      coachId: bookingData.coachId,
      slot: {
        start: bookingData.startTime, // ISO 8601 format
        end: bookingData.endTime       // ISO 8601 format
      },
      topic: bookingData.topic || '',
      notes: bookingData.notes || '',
      useCheckoutSession: false // PaymentIntent flow
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || error.message);
  }
  
  return await response.json();
};

// 3. Process payment with Stripe (happens on your page)
const processPayment = async (stripe, clientSecret, paymentMethodId) => {
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethodId
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return paymentIntent;
};

// 4. Check booking status (poll until booking is created)
const checkBookingStatus = async (paymentIntentId, maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `${API_BASE_URL}/api/stripe/booking-status/${paymentIntentId}`
    );
    const status = await response.json();
    
    if (status.bookingCreated) {
      return status;
    }
    
    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Booking creation timeout. Please contact support.');
};

// 5. Handle success - MANUAL REDIRECT (you control where to go)
if (paymentIntent.status === 'succeeded') {
  const bookingStatus = await checkBookingStatus(paymentIntentId);
  if (bookingStatus.bookingCreated) {
    // ✅ Redirect to your success page
    window.location.href = `/booking-success?bookingId=${bookingStatus.bookingId}`;
  }
}
```

#### Option 2: Checkout Session Flow (With Redirect - Stripe Hosted Page)

```javascript
// 1. Create booking request with Checkout Session
const createBookingWithRedirect = async (bookingData, authToken) => {
  const baseUrl = window.location.origin; // Your frontend URL
  
  const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      coachId: bookingData.coachId,
      slot: {
        start: bookingData.startTime,
        end: bookingData.endTime
      },
      topic: bookingData.topic || '',
      notes: bookingData.notes || '',
      useCheckoutSession: true, // Enable Checkout Session
      successUrl: `${baseUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/booking-cancelled`
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || error.message);
  }
  
  return await response.json();
};

// 2. Redirect to Stripe Checkout Page
const bookingResponse = await createBookingWithRedirect(bookingData, authToken);
const sessionUrl = bookingResponse.data.clientSecret; // Contains Stripe session URL

// Redirect user to Stripe's hosted payment page
window.location.href = sessionUrl;

// 3. Handle redirect back from Stripe (on your success page)
// On /booking-success page:
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

if (sessionId) {
  // Check booking status
  const bookingStatus = await checkBookingStatus(sessionId);
  
  if (bookingStatus.bookingCreated) {
    // ✅ Booking created! Show success message
    console.log('Booking confirmed:', bookingStatus.bookingId);
  } else {
    // Booking might still be processing
    // Poll or show "processing" message
  }
}
```

---

## Redirect Handling

### PaymentIntent Flow (No Redirect)
- **Payment happens:** On your frontend page
- **Redirect:** You handle manually after payment succeeds
- **Success URL:** You control where to redirect
- **Example:** `window.location.href = '/booking-success?bookingId=...'`

### Checkout Session Flow (With Redirect)
- **Payment happens:** On Stripe's hosted page
- **Redirect:** Stripe redirects to your `successUrl` after payment
- **Success URL:** Must be provided in request: `successUrl` parameter
- **Example:** `successUrl: "https://yourdomain.com/booking-success?session_id={CHECKOUT_SESSION_ID}"`
- **Cancel URL:** Must be provided: `cancelUrl` parameter
- **Example:** `cancelUrl: "https://yourdomain.com/booking-cancelled"`

### Success Page Implementation

When Stripe redirects to your success URL, handle it like this:

```typescript
// On your /booking-success page
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (sessionId) {
    // Check if booking was created
    checkBookingStatus(sessionId)
      .then(status => {
        if (status.bookingCreated) {
          // Show success message
          setBookingId(status.bookingId);
          setStatus('success');
        } else {
          // Still processing
          setStatus('processing');
          // Poll again after delay
        }
      })
      .catch(error => {
        setStatus('error');
        setError(error.message);
      });
  }
}, []);
```

---

## Code Examples

### React/TypeScript Example

```typescript
import { useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface BookingData {
  coachId: string;
  startTime: string;
  endTime: string;
  topic?: string;
  notes?: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    paymentIntentId: string;
    clientSecret: string;
    paymentStatus: string;
    amount: number;
    currency: string;
    status: string;
  };
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-api-url.com';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  // Initialize Stripe
  const initializeStripe = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/config`);
      const { publicKey } = await response.json();
      const stripeInstance = await loadStripe(publicKey);
      setStripe(stripeInstance);
      return stripeInstance;
    } catch (err) {
      setError('Failed to initialize Stripe');
      throw err;
    }
  };

  // Create booking request
  const createBooking = async (
    bookingData: BookingData,
    authToken: string
  ): Promise<BookingResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          coachId: bookingData.coachId,
          slot: {
            start: bookingData.startTime,
            end: bookingData.endTime
          },
          topic: bookingData.topic || '',
          notes: bookingData.notes || ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errorMessage || data.message || 'Failed to create booking');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Process payment
  const processPayment = async (
    clientSecret: string,
    paymentMethodId: string
  ) => {
    if (!stripe) {
      await initializeStripe();
    }

    try {
      const { error, paymentIntent } = await stripe!.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethodId
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Check booking status
  const checkBookingStatus = async (
    paymentIntentId: string,
    maxAttempts: number = 10
  ) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/stripe/booking-status/${paymentIntentId}`
        );
        const status = await response.json();

        if (status.bookingCreated) {
          return status;
        }

        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.error('Error checking booking status:', err);
      }
    }

    throw new Error('Booking creation timeout. Please contact support.');
  };

  // Complete booking flow
  const bookSession = async (
    bookingData: BookingData,
    authToken: string,
    paymentMethodId: string
  ) => {
    try {
      // 1. Initialize Stripe
      await initializeStripe();

      // 2. Create booking request
      const bookingResponse = await createBooking(bookingData, authToken);
      const { clientSecret, paymentIntentId } = bookingResponse.data;

      // 3. Process payment
      await processPayment(clientSecret, paymentMethodId);

      // 4. Poll for booking status
      const bookingStatus = await checkBookingStatus(paymentIntentId);

      return {
        success: true,
        bookingId: bookingStatus.bookingId,
        paymentIntentId
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    loading,
    error,
    bookSession,
    createBooking,
    processPayment,
    checkBookingStatus,
    initializeStripe
  };
};
```

### Usage in React Component

```typescript
import React, { useState } from 'react';
import { useBooking } from './hooks/useBooking';

const BookingForm: React.FC = () => {
  const { bookSession, loading, error } = useBooking();
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await bookSession(
        {
          coachId: '507f1f77bcf86cd799439012',
          startTime: '2024-12-25T14:00:00Z',
          endTime: '2024-12-25T14:30:00Z',
          topic: 'Career Guidance',
          notes: 'Looking for help'
        },
        'your-jwt-token',
        paymentMethodId
      );

      alert(`Booking confirmed! Booking ID: ${result.bookingId}`);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Book Session'}
      </button>
    </form>
  );
};
```

---

## Error Handling

### Common Error Scenarios

1. **Invalid Time Slot**
   - **Error:** `"Start time must be before end time"`
   - **Solution:** Validate time slot before submitting

2. **Coach Pricing Not Set**
   - **Error:** `"Coach has not set their hourly rate"`
   - **Solution:** Show message to user, suggest contacting coach

3. **Time Slot Unavailable**
   - **Error:** `"This time slot is already booked"`
   - **Solution:** Refresh available slots and let user select another time

4. **Payment Failed**
   - **Error:** Stripe payment error
   - **Solution:** Show error message, allow retry

5. **Booking Creation Timeout**
   - **Error:** `"Booking creation timeout"`
   - **Solution:** Show message, provide support contact, check booking status later

### Error Handling Example

```typescript
const handleBookingError = (error: any) => {
  const errorMessages: Record<string, string> = {
    'Invalid time slot': 'Please select a valid time slot',
    'Coach pricing not set': 'This coach has not set their pricing. Please contact them.',
    'Time slot unavailable': 'This time slot is no longer available. Please select another time.',
    'Payment failed': 'Payment could not be processed. Please try again.',
    'Booking creation timeout': 'Booking is being processed. Please check your bookings page in a few moments.'
  };

  const message = errorMessages[error.message] || error.message || 'An unexpected error occurred';
  return message;
};
```

---

## Testing

### Test Payment Methods

Stripe provides test card numbers for testing:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

### Testing Checklist

1. ✅ Get Stripe config successfully
2. ✅ Create booking request with valid data
3. ✅ Handle invalid time slot error
4. ✅ Handle coach pricing not set error
5. ✅ Handle time slot unavailable error
6. ✅ Process payment with test card
7. ✅ Poll booking status after payment
8. ✅ Verify booking appears in user sessions
9. ✅ Handle payment failure gracefully
10. ✅ Handle booking creation timeout

---

## Important Notes

1. **Payment Required**: Bookings are only created after successful payment. The initial booking request only creates a payment intent.

2. **Webhook Dependency**: Bookings are created via webhook after payment succeeds. There may be a slight delay (usually < 5 seconds).

3. **Polling**: After payment succeeds, poll the booking status endpoint to confirm booking creation. Maximum recommended polling attempts: 10 (with 2-second intervals).

4. **Fallback Mechanism**: The booking status endpoint has a fallback mechanism. If the webhook fails, it will attempt to create the booking automatically.

5. **Payment Tracking**: All bookings include payment information:
   - `isPaymentDone`: Boolean indicating if payment was completed
   - `paidAt`: Timestamp when payment was completed
   - `amount`: Payment amount in smallest currency unit (e.g., cents)
   - `currency`: Payment currency code

6. **Time Format**: All times must be in ISO 8601 format (e.g., `"2024-12-25T14:00:00Z"`).

7. **Authentication**: All booking endpoints (except webhook) require JWT authentication token in the `Authorization` header.

---

### 7. Get Coach Schedule (Available & Booked Slots)

**Endpoint:** `GET /api/v1/coach/me/schedule`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `startDate` (optional): Start date in `YYYY-MM-DD` format (defaults to today)
- `endDate` (optional): End date in `YYYY-MM-DD` format (defaults to startDate + days)
- `days` (optional): Number of days from startDate if endDate not provided (default: 30, max: 90)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Schedule retrieved successfully for 30 days",
  "data": {
    "coachId": "507f1f77bcf86cd799439012",
    "coachName": "John Coach",
    "timezone": "America/New_York",
    "startDate": "2024-12-01T00:00:00Z",
    "endDate": "2024-12-31T00:00:00Z",
    "sessionDurationMinutes": 30,
    "price": {
      "amount": 100.00,
      "currency": "USD"
    },
    "days": [
      {
        "date": "2024-12-25",
        "dayOfWeek": "Wednesday",
        "isAvailable": true,
        "totalSlots": 16,
        "availableSlots": 12,
        "bookedSlots": 3,
        "pastSlots": 1,
        "slots": [
          {
            "start": "2024-12-25T09:00:00Z",
            "end": "2024-12-25T09:30:00Z",
            "status": "past"
          },
          {
            "start": "2024-12-25T14:00:00Z",
            "end": "2024-12-25T14:30:00Z",
            "status": "booked",
            "bookingId": "507f1f77bcf86cd799439011",
            "studentName": "Jane Student",
            "studentId": "507f1f77bcf86cd799439013",
            "topic": "Career Guidance",
            "meetingLink": "https://meet.google.com/abc-defg-hij",
            "isPaymentDone": true,
            "paidAt": "2024-12-20T10:30:00Z"
          },
          {
            "start": "2024-12-25T15:00:00Z",
            "end": "2024-12-25T15:30:00Z",
            "status": "available"
          }
        ]
      }
    ]
  },
  "method": "GET /api/v1/coach/me/schedule"
}
```

**Use Cases:**
- Calendar view showing all slots
- Identify available vs booked slots
- View booking details for each slot
- Track payment status for bookings
- Plan availability adjustments

**Example Usage:**
```typescript
const getCoachSchedule = async (
  authToken: string,
  startDate?: string,
  endDate?: string,
  days: number = 30
) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  params.append('days', days.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/schedule?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch schedule');
  }

  return await response.json();
};
```

---

## Support

For issues or questions:
- Check API documentation
- Review error messages carefully
- Contact backend team for webhook issues
- Check Stripe Dashboard for payment status

---

## Changelog

### Version 1.0.0 (Current)
- Initial payment-first booking flow implementation
- Stripe integration
- Webhook-based booking creation
- Payment tracking fields

