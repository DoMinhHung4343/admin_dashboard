# 📡 API Gaps & Recommended Endpoints

Generated: April 17, 2026

## Summary
Your admin dashboard has good coverage of existing APIs, but is missing some critical admin-specific endpoints that would improve efficiency and user experience.

---

## 🟢 Existing & Working Endpoints

### Identity Service
- ✅ `/users?page=...&size=...` - User listing (working)
- ✅ `/users/{id}/ban` - Ban user (working)
- ✅ `/users/my-profile` - Current user profile (used in auth)
- ✅ `/users/change-password` - Password change (available)

### Music Service
- ✅ `/genres` - Genre listing (dashboard: music tab)
- ✅ `/admin/songs` - Song management (dashboard: music tab)
- ✅ `/admin/songs/batch-lookup` - Batch song lookup (music page, smart!)
- ✅ `/playlists/my-playlists` - My playlists (music tab)
- ✅ `/social/admin/listen/top-songs` - Top songs (dashboard)
- ✅ `/admin/albums/top-favorites-*` - Album top favorites (music tab)
- ✅ `/admin/jamendo/import` - Custom import (music tab)

### Subscription/Payment Service
- ✅ `/admin/subscriptions/plans` - Plans listing (dashboard)
- ✅ `/admin/subscriptions/stats` - Revenue stats (dashboard chart)
- ⚠️ Partially: Only revenue time-series, missing detailed breakdown

### Ads Service
- ✅ `/admin/ads` - Ads listing (dashboard)
- ✅ Ads include: impressions, clicks, CTR, budget, status

### Social/Analytics
- ✅ `/social/admin/listen/top-songs` - Trending songs
- ✅ User favorites (heart) system

---

## 🔴 Critical Missing Endpoints (High Priority)

### 1. **Admin User Statistics** ⭐
**Current:** Fetching `/users?page=1&size=1` just to count total users - wastes API call!

**Recommended:**
```
GET /admin/users/stats
Response: {
  totalUsers: number,
  activeUsers: number,
  newUsersLast7Days: number,
  newUsersLast30Days: number,
  byStatus: { ACTIVE: number, BANNED: number, PENDING_VERIFICATION: number },
  byRole: { USER: number, ADMIN: number, ARTIST: number },
  avgSessionDurationMins: number,
  churnRatePercent: number
}
```
**Impact:** Replace 1 wasteful call with 1 complete stats call = Same load, better data

---

### 2. **Admin Aggregate Dashboard Summary** ⭐⭐
**Current:** Dashboard makes 4 API calls to gather stats (users, plans, ads, revenue)

**Recommended:**
```
GET /admin/analytics/summary?from=DATE&to=DATE&window=7D|1M|1Y
Response: {
  metrics: {
    totalStreams: number,
    totalStreamRevenue: number,
    uniqueListeners: number,
    adImpressions: number,
    adClicks: number,
    adCtr: number,
    subscriptionRevenue: number,
    topGenreId: string,
    topGenreName: string,
    newSubscribers: number,
    cancelledSubscribers: number,
    churnRate: number
  },
  chartData: {
    streamsByDay: [{ date: string, count: number }],
    revenueByDay: [{ date: string, total: number }],
    adImpressionsByDay: [{ date: string, count: number }]
  }
}
```
**Impact:** 4 calls → 1 call, better data aggregation = ~300ms faster page load

---

### 3. **Advertiser Management System** 🟡
**Current:** Can view ads but can't manage advertisers

**Recommended:**
```
GET /admin/advertisers
POST /admin/advertisers
PATCH /admin/advertisers/{id}
DELETE /admin/advertisers/{id}
GET /admin/advertisers/{id}/campaigns
GET /admin/advertisers/{id}/performance
```

**Fields:**
```typescript
interface Advertiser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contactPerson?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  totalBudgetVnd: number;
  usedBudgetVnd: number;
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'WALLET';
  website?: string;
  industry?: string;
  createdAt: string;
  activeAdsCount: number;
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
}
```

---

### 4. **Artist Management** 🟡
**Current:** Only via songs, no artist-specific admin features

**Recommended:**
```
GET /admin/artists?verified=true|false&status=ACTIVE|PENDING
POST /admin/artists
PATCH /admin/artists/{id}
DELETE /admin/artists/{id}
GET /admin/artists/{id}/songs
GET /admin/artists/{id}/stats
POST /admin/artists/{id}/verify
POST /admin/artists/{id}/suspend
```

**Fields:**
```typescript
interface Artist {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  verified: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  songCount: number;
  totalStreams: number;
  followers: number;
  genres: string[];
  website?: string;
  socialLinks?: { platform: string, url: string }[];
  createdAt: string;
  lastActive: string;
}
```

---

### 5. **Content Moderation Dashboard** 🟡
**Current:** No moderation features visible

**Recommended:**
```
GET /admin/content/pending-verification?type=SONG|ARTIST|PLAYLIST
POST /admin/content/{id}/approve
POST /admin/content/{id}/reject
PUT /admin/content/{id}/flag
GET /admin/content/flags
GET /admin/moderation-queue/stats
```

**Queue Item:**
```typescript
interface ModerationItem {
  id: string;
  type: 'SONG' | 'ARTIST' | 'PLAYLIST';
  contentId: string;
  contentTitle: string;
  submittedBy: string;
  submittedAt: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  flags?: { type: string, count: number }[];
}
```

---

### 6. **Payment Transaction History** 🟡
**Current:** Only revenue summary, no transaction-level details

**Recommended:**
```
GET /admin/payments/transactions?from=DATE&to=DATE&page=0&size=20
GET /admin/payments/metrics?period=7D|1M|1Y
GET /admin/payments/{id}/details

interface PaymentTransaction {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: 'VND' | 'USD';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'WALLET';
  transactionDate: string;
  expiryDate?: string;
  reference?: string;
}

interface PaymentMetrics {
  totalRevenue: number,
  transactionCount: number,
  successRate: number,
  avgTransactionValue: number,
  topPaymentMethod: string,
  refundCount: number,
  refundTotal: number
}
```

---

### 7. **Audit Logs** 🟡
**Current:** No audit trail for admin actions

**Recommended:**
```
GET /admin/audit-logs?resource=USERS|SONGS|ADS|PLANS&action=CREATE|UPDATE|DELETE|BAN
GET /admin/audit-logs/{id}
```

**Fields:**
```typescript
interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'BAN' | 'UNBAN' | 'VERIFY';
  resource: 'USER' | 'SONG' | 'ARTIST' | 'PLAYLIST' | 'AD' | 'PLAN';
  resourceId: string;
  resourceName?: string;
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}
```

---

## 🟡 Enhancement Requests (Medium Priority)

### 1. **Genre Search & Filter**
```
GET /genres/search?q=rock
GET /genres?sortBy=popularity|name&order=asc|desc
```

---

### 2. **Song Analytics Per Period**
**Current:** `/social/admin/listen/top-songs` only shows overall top songs

**Add:**
```
GET /admin/songs/{id}/stats?from=DATE&to=DATE
Response: {
  streams: number,
  uniqueListeners: number,
  avgListenTimePercent: number,
  skipRate: number,
  saveRate: number,
  shareCount: number,
  trends: 'RISING' | 'STABLE' | 'DECLINING'
}
```

---

### 3. **Playlist Analytics**
```
GET /admin/playlists/{id}/stats
GET /admin/playlists/trending
```

---

### 4. **User Engagement Metrics**
```
GET /admin/users/{id}/engagement
Response: {
  totalListens: number,
  uniqueSongsListened: number,
  favoriteGenres: string[],
  avgSessionDurationMins: number,
  lastActive: string,
  subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'NONE',
  lifetime value (estimated): number
}
```

---

## 📊 Implementation Priority Matrix

| Endpoint | Impact | Difficulty | Priority |
|---|---|---|---|
| Admin User Stats | High | Easy | P0 |
| Aggregate Summary | Critical | Medium | P0 |
| Payment Transactions | High | Medium | P1 |
| Advertiser Management | Medium | Hard | P1 |
| Artist Management | Medium | Hard | P1 |
| Moderation Queue | Medium | Hard | P2 |
| Audit Logs | Low | Easy | P2 |
| Song Analytics | Low | Easy | P2 |

---

## 🚀 Quick Wins for Backend Team

**These endpoints will give best ROI:**

1. **`GET /admin/users/stats`** - 10 min to implement, huge dashboard improvement
2. **`GET /admin/analytics/summary`** - 30 min to implement, reduces 4 API calls to 1
3. **`GET /admin/payments/metrics`** - 15 min to implement, essential for payment dashboard

---

## 📝 Current Code Issues Using These Endpoints

### Dashboard Page (`app/dashboard/page.tsx`)
```typescript
// Current: Makes 4 calls
cachedFetch<PageResult<object>>('/users?page=1&size=1', 30_000) // Just for count!
cachedFetch<PageResult<Plan>>('/admin/subscriptions/plans?page=0&size=100', 60_000)
cachedFetch<PageResult<Ad>>('/admin/ads?page=0&size=50', 30_000)
apiFetch<RevenuePoint[]>('/admin/subscriptions/stats?from=...&to=...')

// Better: Make 1 call
apiFetch('/admin/analytics/summary?from=...&to=...')
// Plus 1 for user stats if needed
apiFetch('/admin/users/stats')
```

---

## ✅ Optimization Already Done

- ✅ Request deduplication in `lib/api.ts`
- ✅ Dashboard initial fetches merged into `Promise.all()`
- ✅ Chart components memoized (React.memo)
- ✅ Derived stats wrapped in useMemo
- ✅ Avatar images optimized (lazy loading, size query params)

---

## 🎯 Next Steps

1. **Submit this list to backend team** - They can prioritize and start implementing
2. **Use existing endpoints efficiently** - Your current setup is solid, just use it better
3. **Monitor performance** - Use dashboard response times as baseline
4. **Iterate** - As new endpoints arrive, optimize dashboard to use them

---

**Created by:** v0 Performance Optimization Analysis  
**For:** Music Admin Dashboard  
**Date:** 2026-04-17
