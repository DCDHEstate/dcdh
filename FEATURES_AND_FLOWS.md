# DCDH Estate - Features & Flows (MVP)

> Zero-brokerage real estate platform for Jaipur with WhatsApp-first experience.
>
> **Portal 1** — Owner + Tenant Portal (`dcdh-estate/`)
> **Portal 2** — Admin / Super-Admin Portal (separate project)

---

## Portal 1: Owner + Tenant Portal

### 1. Authentication & Onboarding

- [x] Phone-based login with WhatsApp OTP (HMAC-SHA256 hashed, 10-min expiry, 5-attempt limit)
- [x] Session management with httpOnly cookies (30-day rolling expiry)
- [x] Role selection post-signup (Owner / Tenant)
- [x] Owner profile setup (company, address, bank details, payout method)
- [x] Tenant profile setup (occupation, budget range, preferences, family size, pets)
- [x] Route protection middleware (role-based redirects, suspended account handling)
- [x] Logout (clear session cookie)
- [ ] Profile editing — Owner (update after initial setup)
- [ ] Profile editing — Tenant (update after initial setup)

**Flow:** Phone → OTP (WhatsApp) → Verify → New user? Role Select → Profile Setup → Dashboard | Existing user? → Dashboard

---

### 2. Homepage & Public Pages

- [x] Hero section with CTA
- [x] Search strip with quick filters (category, type, city, locality)
- [x] Featured properties section
- [x] How it Works section
- [x] Owner & Tenant portal cards
- [x] Referral program section (promotional)
- [x] Upcoming features section
- [x] Trust metrics section
- [x] About page
- [x] Contact page (form UI)
- [x] Privacy policy page
- [x] Terms of service page
- [x] How it Works page
- [x] Referral page
- [x] Refund policy page
- [x] List Property landing page
- [x] Owner Portal landing page
- [x] Tenant Portal landing page
- [x] 404 Not Found page
- [ ] Contact form submission API (save to `contact_submissions` table)
- [ ] SEO meta tags per page (dynamic OG tags, title, description)

---

### 3. Property Discovery (Tenant-facing)

- [x] Browse all active properties with pagination
- [x] Filter by category (residential / commercial / land)
- [x] Filter by transaction type (buy / rent)
- [x] Filter by property type (apartment, villa, plot, etc.)
- [x] Filter by price range (min / max)
- [x] Filter by city
- [x] Filter by locality
- [x] Filter by bedrooms
- [x] Filter by furnishing (furnished / semi / unfurnished)
- [x] Full-text search on title and description
- [x] Sort by newest, price asc/desc, most popular
- [x] Property detail page (`/properties/[slug]`)
- [ ] Search page UI (currently shows "Coming Soon")
- [ ] Map-based property search (lat/lng stored, UI not built)
- [ ] Similar / nearby property suggestions
- [ ] Recently viewed properties

**Flow:** Search/Filter → Browse results → Property Detail → Inquire (create lead) or Save property

---

### 4. Saved Properties / Wishlist (Tenant)

- [x] Save / unsave a property (toggle API)
- [x] View saved properties list (API)
- [x] Saved properties dashboard page (`/dashboard/tenant/saved`)
- [ ] Remove from saved directly from list view

---

### 5. Property Listing (Owner)

- [x] Multi-step property listing form (5 steps)
- [x] Step 1 — Category, transaction type, property type
- [x] Step 2 — Address, state, city, locality, pincode (cascading dropdowns)
- [x] Step 3 — Area, bedrooms, bathrooms, floor, furnishing, amenities
- [x] Step 4 — Photo upload to AWS S3 (presigned URLs, multiple images)
- [x] Step 5 — Price, deposit, maintenance charge, availability
- [x] Auto-generated SEO slug
- [x] Property submitted as `pending_approval`
- [x] View all my properties (`/dashboard/owner/properties`)
- [ ] Edit existing property
- [ ] Archive / delete property
- [ ] Duplicate / relist property
- [ ] Property view count tracking (schema has `view_count`, increment logic needed)
- [ ] Google Maps URL / embed on property detail
- [ ] Video upload for property (schema supports it, UI not built)

**Flow:** Owner Dashboard → Post Property → 5-step form → Submit (pending_approval) → Admin reviews → Active or Rejected

---

### 6. Lead / Inquiry Management

- [x] Create inquiry on a property — tenant submits name, phone, message
- [x] View all leads on my properties — owner dashboard (`/dashboard/owner/leads`)
- [x] Lead details (name, phone, email, message)
- [x] Lead list pagination
- [ ] Lead status updates in UI (new → contacted → interested → visited → closed_won/lost)
- [ ] Lead activity log (table exists, not wired to UI)
- [ ] WhatsApp redirect to chat with inquirer
- [ ] Follow-up scheduling (`next_follow_up_at` field exists)

**Flow:** Tenant inquires → Lead created (new) → Owner sees in dashboard → Contacts tenant → Updates status through lifecycle

---

### 7. Owner Dashboard

- [x] Dashboard layout with sidebar (desktop) and bottom nav (mobile)
- [x] Stat cards (total properties, active listings, total leads, active tenancies, rent this month, open complaints, total views)
- [x] Quick action buttons (post property, tenancies, rent, complaints)
- [ ] Recent leads list on dashboard (latest 5)
- [ ] Property performance overview (views & inquiries per property)
- [ ] Notifications panel

---

### 8. Tenant Dashboard

- [x] Dashboard layout with sidebar (desktop) and bottom nav (mobile)
- [x] Stat cards (saved properties, active tenancy, next rent due, open complaints)
- [x] Quick action buttons (browse, my tenancy, rent, raise complaint)
- [ ] Recent inquiries list on dashboard
- [ ] Recommended properties based on preferences
- [ ] Notifications panel

---

### 9. Tenancy Management (Post-deal)

- [x] View active tenancy details — tenant (lease dates, rent, deposit)
- [x] Agreement document upload / view
- [x] Tenancy status tracking (upcoming → active → completed / terminated)
- [x] View tenants on my property — owner
- [ ] Tenancy termination request

**Flow:** Admin creates tenancy (tenant + property + owner) → Tenant sees in dashboard → Owner sees tenant details → Lease ends → Security deposit refund

---

### 10. Rent Payment Tracking

- [x] View rent due for current month — tenant
- [x] Rent payment history — tenant
- [x] Mark rent as paid (manual for MVP — admin marks)
- [x] Late fee calculation (overdue detection)
- [x] Rent collection overview — owner
- [ ] Payout tracking to owner
- [ ] Payment receipt generation

**Flow:** Active tenancy → Monthly rent entry generated → Tenant sees due → Pays offline → Admin marks paid → Payout tracked → Overdue? Late fee + notification

---

### 11. Security Deposit Management

- [ ] Track security deposit paid
- [ ] Deposit refund process at tenancy end
- [ ] Deductions with reason
- [ ] Refund status tracking

---

### 12. Complaints / Maintenance Requests

- [x] Raise complaint — tenant (category, priority, description, photos)
- [x] Complaint categories (plumbing, electrical, pest control, security, etc.)
- [x] Priority levels (low / medium / high / urgent)
- [x] Attach photos/videos to complaint (presigned URL upload)
- [x] View complaint status — tenant
- [x] Comment thread on complaint
- [x] View complaints on my properties — owner
- [x] Satisfaction rating after resolution (1-5)

**Flow:** Tenant raises complaint → Owner notified → Status: open → acknowledged → in_progress → resolved → Tenant rates satisfaction

---

### 13. Referral Program

- [ ] Refer a friend (share phone number)
- [ ] Refer a property (owner contact, location details)
- [ ] Track referral status (pending → registered → deal_closed → rewarded)
- [ ] Referral rewards credited to wallet
- [ ] Upload media with property referral

**Flow:** Refer friend → Friend registers → Deal closes → Reward credited | Refer property → DCDH onboards → Deal closes → Reward credited

---

### 14. Wallet System

- [ ] View wallet balance
- [ ] Transaction history (credit / debit log)
- [ ] Referral reward credits
- [ ] Signup bonus
- [ ] Withdrawal request

---

### 15. Service Requests (Value-added)

- [ ] Request architect
- [ ] Request interior designer
- [ ] PG booking inquiry
- [ ] Farmhouse / resort booking
- [ ] Coworking space inquiry

---

### 16. Notifications

- [ ] In-app notification list
- [ ] Unread notification count (badge)
- [ ] Mark as read
- [ ] Notification types (lead, payment, property status, complaint, referral, system)
- [ ] WhatsApp notification delivery (via GetGabs API)

---

### 17. Location Data

- [x] State → City → Locality hierarchy (API endpoints)
- [x] Jaipur pre-seeded with 40+ localities
- [x] Popular / featured locality flags
- [ ] Auto-update city/locality property counts

---

### 18. Global UI/UX

- [x] Responsive header with navigation
- [x] Footer with links
- [x] Scroll reveal animations
- [x] Mobile-responsive layouts
- [ ] Loading states / skeleton screens
- [ ] Error boundaries / error pages
- [ ] Toast notifications (success / error feedback)
- [ ] Image gallery / lightbox on property detail
- [ ] Share property (WhatsApp, copy link)

---

## Portal 2: Admin / Super-Admin Portal

### 19. Admin Authentication & Access

- [ ] Admin login (phone OTP, restricted to `role = admin`)
- [ ] Super-admin vs admin role differentiation (via `permissions` JSONB)
- [ ] Permission-based UI (show/hide sections based on permissions)
- [ ] Admin profile management (department, designation)

---

### 20. Admin Dashboard

- [x] Platform stats overview (total users, properties, leads, active tenancies, overdue payments, open complaints, pending approvals)
- [ ] Today's activity summary (new signups, properties, leads)
- [x] Pending property approvals count
- [x] Overdue payments count
- [x] Open complaints count
- [x] Quick action buttons (properties, tenancies, rent, complaints)

---

### 21. User Management

- [ ] View all users with search and filter (by role, status)
- [ ] User detail view (profile, properties, leads, tenancies)
- [ ] Suspend / activate user
- [ ] Verify owner profile
- [ ] Verify tenant profile
- [ ] View / approve uploaded documents (aadhaar, PAN, etc.)
- [ ] Create admin users (super-admin only)
- [ ] Manage admin permissions (super-admin only)

**Flow:** Users list → Search/filter → View user → Verify / Suspend / Activate → Review documents → Approve or Reject with reason

---

### 22. Property Management

- [ ] View all properties across all statuses
- [ ] Property approval queue (pending_approval list)
- [ ] Approve property (set active, record reviewer)
- [ ] Reject property with reason
- [ ] Edit any property (admin override)
- [ ] Archive / deactivate property
- [ ] Feature a property (boost visibility)
- [ ] Property analytics (views, inquiries)

**Flow:** Owner submits → Approval queue → Admin reviews → Approve (goes live, owner notified) or Reject (reason sent, owner can edit & resubmit)

---

### 23. Lead Management

- [ ] View all leads across platform
- [ ] Filter by status, source, date range
- [ ] Assign lead to admin team member
- [ ] Update lead status (full lifecycle)
- [ ] Add notes to lead
- [ ] Lead activity timeline
- [ ] Follow-up reminders
- [ ] Lead conversion analytics

---

### 24. Tenancy Management

- [x] Create new tenancy (bind tenant + property + owner)
- [x] Set lease terms (dates, rent, deposit, increment %, lock-in, notice period)
- [x] Upload agreement document (S3 presigned URL)
- [x] View all active tenancies (with filters and pagination)
- [ ] Terminate tenancy with reason
- [ ] Renew tenancy

---

### 25. Payment Management

- [x] Generate monthly rent entries for active tenancies
- [x] View all rent payments (filter by status, tenant, month)
- [x] Mark rent as paid (payment method, reference)
- [x] Mark rent as waived
- [x] Overdue detection (auto-marks past-due payments)
- [ ] Owner payout tracking (mark payout done)
- [ ] Security deposit management (track deposits and refunds)
- [ ] Payment reports / export

---

### 26. Complaint Management

- [x] View all complaints (filter by status, priority)
- [ ] Assign complaint to team member
- [x] Update complaint status (open → acknowledged → in_progress → resolved → closed)
- [x] Add admin comments
- [x] Mark as resolved (with resolution notes)
- [ ] Complaint analytics (avg resolution time)

---

### 27. Referral Management

- [ ] View all referrals
- [ ] Update referral status
- [ ] Approve referral reward (credit to wallet)
- [ ] Referral analytics

---

### 28. Location Management

- [ ] Add / edit states
- [ ] Add / edit cities
- [ ] Add / edit localities (mark as popular, set coordinates, pincode)
- [ ] Activate / deactivate locations

---

### 29. Service Request Management

- [ ] View all service requests
- [ ] Forward to WhatsApp
- [ ] Update request status

---

### 30. Contact Submissions

- [ ] View all contact form submissions
- [ ] Mark as resolved (with `resolved_by`)
- [ ] Reply via WhatsApp

---

### 31. Notifications Management

- [ ] Send notification to specific user
- [ ] Send bulk notifications (by role, city, etc.)
- [ ] System notification templates
- [ ] WhatsApp broadcast

---

### 32. Admin Activity & Audit

- [ ] Activity log of all admin actions
- [ ] Filter by admin, action type, date
- [ ] Export audit trail

---

### 33. Analytics & Reports

- [ ] User growth (signups over time)
- [ ] Property listing trends
- [ ] Lead conversion funnel
- [ ] Revenue overview (rent collected, payouts)
- [ ] City / locality wise property distribution
- [ ] Top performing properties (views, inquiries)
