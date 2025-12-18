# Frontend API Integration Guide

This guide shows how to integrate the backend APIs with your React components using the new service functions and hooks.

## Services Created

Located in `src/services/`:

1. **dashboardTransactionService.ts** - Transaction stats & export
2. **paymentMethodService.ts** - Payment methods management
3. **subscriptionStatusService.ts** - Subscription operations
4. **adminUsersService.ts** - Admin user management
5. **adminTransactionsService.ts** - Admin transaction management
6. **adminAnalyticsService.ts** - Admin analytics dashboard

## Hooks Created

Located in `src/hooks/`:

1. **useTransactionDashboard.ts** - For transaction stats & export
2. **usePaymentMethods.ts** - For payment method operations
3. **useSubscription.ts** - For subscription status & creation
4. **useAdminUsers.ts** - For admin user listing
5. **useAdminTransactions.ts** - For admin transaction listing
6. **useAdminAnalytics.ts** - For analytics dashboard

---

## Component Integration Examples

### 1. Transaction Dashboard Component

```tsx
import { useTransactionStats, useExportTransactions } from "@/hooks/useTransactionDashboard";

export function TransactionDashboard() {
  const { data: stats, isLoading, error } = useTransactionStats();
  const { mutate: exportTransactions } = useExportTransactions();

  if (isLoading) return <div>Loading stats...</div>;
  if (error) return <div>Error loading stats</div>;

  const handleExportCSV = () => {
    exportTransactions({ format: "csv" });
  };

  return (
    <div>
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p>${stats?.totalSpent.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Invoice Count</h3>
          <p>{stats?.invoiceCount}</p>
        </div>
        <div className="stat-card">
          <h3>Spending Trend</h3>
          <p className={stats?.spendingTrend.direction === "up" ? "text-green" : "text-red"}>
            {stats?.spendingTrend.direction === "up" ? "↑" : "↓"} {stats?.spendingTrend.percentage}%
          </p>
        </div>
      </div>

      <button onClick={handleExportCSV}>Export as CSV</button>
    </div>
  );
}
```

---

### 2. Payment Methods Component

```tsx
import {
  usePaymentMethods,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/hooks/usePaymentMethods";

export function PaymentMethods() {
  const { data: methods, isLoading } = usePaymentMethods();
  const { mutate: deleteMethod } = useDeletePaymentMethod();
  const { mutate: setDefault } = useSetDefaultPaymentMethod();

  if (isLoading) return <div>Loading payment methods...</div>;

  return (
    <div className="payment-methods">
      {methods?.map((method) => (
        <div key={method.id} className="payment-card">
          <div>
            <p>{method.brand.toUpperCase()} ending in {method.last4}</p>
            <p>Expires: {method.expiryMonth}/{method.expiryYear}</p>
            {method.isDefault && <span className="badge">Default</span>}
          </div>
          <div className="actions">
            {!method.isDefault && (
              <button onClick={() => setDefault(method.id)}>
                Set as Default
              </button>
            )}
            <button onClick={() => deleteMethod(method.id)} className="delete">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. Subscription Component

```tsx
import { useSubscriptionStatus, useCreateSubscription } from "@/hooks/useSubscription";

export function SubscriptionManager() {
  const { data: subscription, isLoading } = useSubscriptionStatus();
  const { mutate: createSubscription } = useCreateSubscription();

  const handleUpgrade = (planId: string) => {
    createSubscription(
      { planId, paymentMethodId: "pm_default" },
      {
        onSuccess: (data) => {
          console.log("Subscription created:", data);
        },
      }
    );
  };

  return (
    <div>
      <h2>Your Subscription</h2>
      {subscription?.hasActiveSubscription ? (
        <div>
          <p>Plan: {subscription.planId}</p>
          <p>Status: {subscription.status}</p>
          <p>Expires: {subscription.expiryDate}</p>
        </div>
      ) : (
        <div>
          <p>No active subscription</p>
          <button onClick={() => handleUpgrade("plan_premium_monthly")}>
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### 4. Admin Users Management Component

```tsx
import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export function AdminUsersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data: response, isLoading } = useAdminUsers({
    page,
    limit: 20,
    search,
    role,
  });

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 when filtering
          }}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="coach">Coach</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {response?.items.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>{new Date(user.joinedDate).toLocaleDateString()}</td>
              <td>{user.subscriptionStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!response?.items || response.items.length < 20}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

### 5. Admin Transactions Component

```tsx
import { useState } from "react";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";

export function AdminTransactionsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data: response, isLoading } = useAdminTransactions({
    page,
    limit: 20,
    search,
    status,
  });

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by user or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {response?.items.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.userName}</td>
              <td>{txn.userEmail}</td>
              <td>${txn.amount.toFixed(2)}</td>
              <td>{txn.status}</td>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!response?.items || response.items.length < 20}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

### 6. Admin Analytics Dashboard Component

```tsx
import { useState } from "react";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";

export function AdminAnalyticsDashboard() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const { data: analytics, isLoading } = useAdminAnalytics(period);

  if (isLoading) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="period-selector">
        <button onClick={() => setPeriod("week")}>Week</button>
        <button onClick={() => setPeriod("month")}>Month</button>
        <button onClick={() => setPeriod("year")}>Year</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="value">{analytics?.stats.totalUsers}</p>
          <p className="growth">↑ {analytics?.stats.monthlyGrowth.users}%</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="value">${analytics?.stats.totalRevenue.toFixed(2)}</p>
          <p className="growth">↑ {analytics?.stats.monthlyGrowth.revenue}%</p>
        </div>
        <div className="stat-card">
          <h3>Active Courses</h3>
          <p className="value">{analytics?.stats.activeCourses}</p>
          <p className="growth">↑ {analytics?.stats.monthlyGrowth.courses}%</p>
        </div>
        <div className="stat-card">
          <h3>Growth Rate</h3>
          <p className="value">{analytics?.stats.growthRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Top Coaches */}
      <div className="section">
        <h3>Top Coaches</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Earnings</th>
              <th>Sessions</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.topCoaches.map((coach) => (
              <tr key={coach.id}>
                <td>{coach.name}</td>
                <td>${coach.earnings.toFixed(2)}</td>
                <td>{coach.sessions}</td>
                <td>⭐ {coach.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Courses */}
      <div className="section">
        <h3>Top Courses</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Enrollments</th>
              <th>Revenue</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.topCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.enrollments}</td>
                <td>${course.revenue.toFixed(2)}</td>
                <td>⭐ {course.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <h3>Recent Activity</h3>
        <div className="activity-feed">
          {analytics?.recentActivity.map((activity, idx) => (
            <div key={idx} className="activity-item">
              <span className="type-badge">{activity.type}</span>
              <p>{activity.message}</p>
              <time>{new Date(activity.timestamp).toLocaleString()}</time>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Quick Reference

### Using Transaction Stats
```tsx
const { data: stats } = useTransactionStats();
// stats.totalSpent, stats.invoiceCount, stats.lastPaymentMethod, stats.spendingTrend
```

### Exporting Transactions
```tsx
const { mutate: exportTransactions } = useExportTransactions();
exportTransactions({ format: "csv", startDate: "2025-01-01", endDate: "2025-12-31" });
```

### Payment Methods
```tsx
const { data: methods } = usePaymentMethods();
const { mutate: deleteMethod } = useDeletePaymentMethod();
const { mutate: setDefault } = useSetDefaultPaymentMethod();
```

### Subscription
```tsx
const { data: subscription } = useSubscriptionStatus();
const { mutate: createSubscription } = useCreateSubscription();
```

### Admin Operations
```tsx
const { data: users } = useAdminUsers({ page: 1, limit: 20 });
const { data: transactions } = useAdminTransactions({ page: 1 });
const { data: analytics } = useAdminAnalytics("month");
```

---

## Error Handling

All hooks follow React Query patterns. Handle errors like this:

```tsx
const { data, isLoading, error } = useTransactionStats();

if (error) {
  console.error("Error loading stats:", error);
  return <div>Failed to load stats</div>;
}
```

---

## Data Refresh

React Query automatically handles caching and refreshing:

```tsx
// Refetch data manually
const { refetch } = useTransactionStats();
<button onClick={() => refetch()}>Refresh</button>

// Or trigger refresh on certain events
useEffect(() => {
  const timer = setInterval(() => refetch(), 30000); // Every 30 seconds
  return () => clearInterval(timer);
}, [refetch]);
```

---

## File Structure

```
src/
├── services/
│   ├── dashboardTransactionService.ts     ✅
│   ├── paymentMethodService.ts            ✅
│   ├── subscriptionStatusService.ts       ✅
│   ├── adminUsersService.ts               ✅
│   ├── adminTransactionsService.ts        ✅
│   └── adminAnalyticsService.ts           ✅
├── hooks/
│   ├── useTransactionDashboard.ts         ✅
│   ├── usePaymentMethods.ts               ✅
│   ├── useSubscription.ts                 ✅
│   ├── useAdminUsers.ts                   ✅
│   ├── useAdminTransactions.ts            ✅
│   └── useAdminAnalytics.ts               ✅
└── components/
    └── [Your components using these hooks]
```

---

**Status**: ✅ Ready for Component Integration
