# FixersBD — Use Cases & User Manual

## System Overview

FixersBD is a local worker marketplace for Bangladesh. Customers find nearby skilled workers, contact them, negotiate, hire, and leave reviews. Workers register, build profiles, get verified, and receive job requests.

---

## User Roles

| Role | Description |
|------|-------------|
| **Guest** | Anyone visiting without logging in. Can search and browse workers. |
| **Customer** | Registered user who hires workers. |
| **Worker** | Registered skilled professional who receives job requests. |
| **Admin** | Platform administrator who manages users, categories, and complaints. |

---

## Use Case 1: Guest Browsing

**Actor:** Guest (not logged in)

**Steps:**
1. Visit http://localhost:3000
2. Use the search bar — type a service like "fan repair" or "plumber"
3. Smart search auto-detects the category (e.g. "fan repair" → Electrician)
4. Browse worker cards showing name, rating, skills, price, location
5. Click a worker card to view their full profile
6. See reviews, skills, availability, and hourly rate
7. Click "Login to Hire" → redirected to login page

**Notes:**
- Guests can search, browse, and view profiles freely
- Hiring, favorites, and reviews require login

---

## Use Case 2: Customer Registration

**Actor:** New user

**Steps:**
1. Go to http://localhost:3000/register
2. Select "I need a worker" tab
3. Fill in: Full Name, Email, Phone (01XXXXXXXXX format), Password (min 6 chars)
4. Click "Create Account"
5. Redirected to dashboard

**Test Account:** `tanvir@test.com` / `password123`

---

## Use Case 3: Worker Registration

**Actor:** New worker

**Steps:**
1. Go to http://localhost:3000/register?role=worker
2. Select "I am a worker" tab
3. Fill in: Full Name, Email, Phone, Password
4. Click "Create Account"
5. Redirected to profile setup page (/dashboard/worker/profile)
6. Fill in: Occupation, Category, Skills, Experience, Hourly Rate, Bio, Location
7. Click "Save Profile"

**Test Account:** `rahim.elec@test.com` / `password123`

---

## Use Case 4: Customer Hires a Worker

**Actor:** Customer (logged in)

**Flow:**

```
Customer searches → Finds worker → Clicks "Hire Now" → Job created (pending)
```

**Steps:**
1. Login as customer
2. Go to /search or use homepage search bar
3. Search for a service (e.g. "electrician", "AC repair")
4. Browse results, use filters (Verified Only, Available Now, sort by rating/price)
5. Click a worker card to view profile
6. Review their rating, skills, completed jobs, reviews
7. Click **"Hire Now"**
8. Job request is created with status `pending`
9. Worker receives a notification
10. Customer is redirected to dashboard showing "Waiting for worker" badge

**Restrictions:**
- Must be logged in as a customer
- Workers and admins cannot hire

---

## Use Case 5: Worker Accepts/Rejects a Job

**Actor:** Worker (logged in)

**Flow:**
```
Worker sees pending job → Accepts or Rejects
```

**Steps:**
1. Login as worker
2. Go to /dashboard — shows "Job Requests" heading
3. See pending job requests from customers
4. For each pending job:
   - Click **"Accept"** → status changes to `deal_final`
   - Click **"Reject"** → status changes to `cancelled`
5. After accepting, click **"Start Job"** → status changes to `in_progress`

---

## Use Case 6: Complete Job Flow (Full Lifecycle)

**Actors:** Customer + Worker

**Status Flow:**
```
pending → deal_final → in_progress → completed
```

| Step | Who | Action | New Status |
|------|-----|--------|------------|
| 1 | Customer | Clicks "Hire Now" on worker profile | `pending` |
| 2 | Worker | Clicks "Accept" on dashboard | `deal_final` |
| 3 | Worker | Clicks "Start Job" | `in_progress` |
| 4 | Customer | Clicks "Mark Complete" | `completed` |
| 5 | Customer | Clicks "Review" → submits rating & comment | Review saved |

**Cancel:** Either party can cancel during `pending` or `deal_final` stages.

---

## Use Case 7: Leave a Review

**Actor:** Customer (after job is completed)

**Steps:**
1. Go to /dashboard
2. Find a completed job
3. Click **"Review"** button
4. Select star rating (1-5)
5. Write a comment (min 5 characters)
6. Click **"Submit"**
7. Worker's average rating is recalculated
8. Worker receives a notification

**Rules:**
- Only one review per job
- Only the customer who hired can review
- Only after job status is `completed`

---

## Use Case 8: Save Favorites

**Actor:** Customer (logged in)

**Steps:**
1. Visit a worker's profile page
2. Click **"Save"** (heart icon) in the sidebar
3. Worker is added to favorites
4. View all favorites at /favorites
5. Click again to remove from favorites

---

## Use Case 9: Smart Search System

**Actor:** Any user

**How it works:**

| User Types | System Detects | Shows |
|------------|---------------|-------|
| "fan repair" | Electrician | Electricians nearby |
| "water leak" | Plumber | Plumbers nearby |
| "bike not starting" | Motorcycle Mechanic | Bike mechanics |
| "cook" | Cook | Cooks nearby |
| "AC gas" | AC Technician | AC technicians |

**Features:**
- Auto-suggest dropdown appears after 2 characters
- Keyboard navigation (arrow keys + Enter)
- Location detection button (GPS icon) — finds workers near you
- Filters: Verified Only, Available Now
- Sort: Top Rated, Lowest Price, Most Experienced, Nearest

---

## Use Case 10: Auto Location Detection

**Actor:** Any user

**Steps:**
1. Click the location pin icon (📍) in the search bar
2. Browser asks for GPS permission
3. If allowed → coordinates are captured
4. Search results sorted by distance ("Nearest" sort)
5. Worker cards show distance in km

**Fallback:** If GPS denied, workers are shown without distance sorting.

---

## Use Case 11: Admin Dashboard

**Actor:** Admin

**Login:** `admin@fixersbd.com` / `password123`

**Steps:**
1. Login → redirected to /admin
2. See overview stats: Total Users, Workers, Jobs Completed, Pending Complaints
3. View Top Workers list with verify button
4. View Popular Categories with worker counts
5. View Recent Jobs table

**Admin Actions:**
- **Verify a worker:** Click "Verify" next to a worker → sets them as Fully Verified
- **Ban a user:** PATCH /api/admin/users/:id with `{ "isBanned": true }`
- **Manage categories:** POST /api/categories to add new ones

---

## Use Case 12: Worker Profile Management

**Actor:** Worker (logged in)

**Steps:**
1. Go to /dashboard/worker/profile
2. Update: Occupation, Category, Skills, Experience, Hourly Rate, Bio, Availability, Location
3. Click "Save Profile"

**Availability Options:**
- `Available` — shown with green dot, appears in "Available Now" filter
- `Busy` — visible but marked as busy
- `Offline` — still searchable but no availability badge

---

## Use Case 13: Notifications

**Actor:** Any logged-in user

**Steps:**
1. Click bell icon in navbar
2. View notifications at /notifications
3. Unread notifications have a blue left border

**Notification Triggers:**
| Event | Who Gets Notified | Message |
|-------|-------------------|---------|
| Customer hires worker | Worker | "New Job Request" |
| Job status changes | Other party | "Job Status Updated" |
| Review submitted | Worker | "New Review — X stars" |

---

## Verification Badge System

| Level | Badge | Requirements |
|-------|-------|-------------|
| None | — | Just registered |
| Basic Verified | ✓ | Phone verified |
| Fully Verified | ✓✓ | Phone + NID + Photo verified |
| Trusted Pro | ⭐ | Full verification + Admin approval + Good track record |

---

## API Quick Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login |
| `/api/auth/logout` | POST | No | Logout |
| `/api/auth/me` | GET | Yes | Get current user |
| `/api/auth/me` | PATCH | Yes | Update profile |
| `/api/workers` | GET | No | Search workers |
| `/api/workers/:id` | GET | No | Worker detail + reviews |
| `/api/jobs` | POST | Customer | Create job request |
| `/api/jobs` | GET | Yes | List my jobs |
| `/api/jobs/:id/status` | PATCH | Yes | Update job status |
| `/api/reviews` | POST | Customer | Submit review |
| `/api/favorites` | GET | Yes | List favorites |
| `/api/favorites` | POST | Yes | Toggle favorite |
| `/api/categories` | GET | No | List categories |
| `/api/categories` | POST | Admin | Add category |
| `/api/complaints` | POST | Yes | File complaint |
| `/api/notifications` | GET | Yes | List notifications |
| `/api/admin/stats` | GET | Admin | Dashboard stats |
| `/api/admin/users/:id` | PATCH | Admin | Manage user |

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@fixersbd.com` | `password123` |
| Customer | `tanvir@test.com` | `password123` |
| Customer | `nusrat@test.com` | `password123` |
| Customer | `imran@test.com` | `password123` |
| Worker (Electrician) | `rahim.elec@test.com` | `password123` |
| Worker (Plumber) | `karim.plumb@test.com` | `password123` |
| Worker (AC Tech) | `jamal.ac@test.com` | `password123` |
| Worker (Carpenter) | `malek.carp@test.com` | `password123` |
| Worker (Cook) | `fatema.cook@test.com` | `password123` |
| Worker (Babysitter) | `nasima.baby@test.com` | `password123` |
