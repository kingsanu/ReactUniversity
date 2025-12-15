# Coach Payment System Overview

## Overview
This document outlines the payment and payout system for coaches on the platform. The system handles session bookings, calculates earnings after deducting platform commissions, and manages periodic payouts to coaches via Stripe or direct bank transfer.

## Key Components

### 1. Platform Commission
- **Standard Rate**: The platform charges a commission fee (e.g., 20%) on every booked session.
- **Calculation**: 
  `Net Earning = Gross Amount - (Gross Amount * Commission Rate)`

### 2. Payout Preferences
Coaches can customize their payout schedule and method in **Settings -> Payments**.

#### Payout Frequency
- **Bi-weekly**: Payouts are processed every two weeks.
- **Monthly**: Payouts are processed on the 1st of every month.

#### Payout Methods
- **Stripe Connect**: Preferred method. Automatic splitting and transfers.
- **Bank Transfer**: Alternative for regions where Stripe is limited. Manual or batch processing.

### 3. Earnings Dashboard
A dedicated page (`/dashboard/coaching/earnings`) allows coaches to track their financial performance.
- **Metrics**: Total Earnings, Pending Payouts, Last Payout.
- **History**: Detailed transaction log showing Gross Amount, Fee, and Net Earning per session.

## Data Flow
1.  **Student wraps booking**: Student pays $100.
2.  **Transaction recorded**: System logs $100 Gross, $20 Fee, $80 Net Pending.
3.  **Session Completion**: After session, status moves from 'Pending' to 'Ready for Payout'.
4.  **Payout Cycle**: System checks Coach's frequency (e.g., Monthly).
5.  **Transfer**: On payout date, accumulated 'Ready' funds are transferred to Coach's Stripe account.

## Future Improvements
- Dynamic commission rates based on coach tier.
- Instant payouts for eligible coaches.
- Detailed tax report generation.
