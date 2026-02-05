-- ============================================================================
-- DCDH Estate - PostgreSQL Database Schema
-- Phase 0 MVP
-- ============================================================================
-- Auth: Google Sign-In + Role-based access control
-- Features: Users, Properties, Leads, Referrals, Owner Portal, Tenant Portal,
--           Admin Portal, Search & Filtering, Wallet
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'owner', 'tenant');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending_verification');

CREATE TYPE property_category AS ENUM ('residential', 'commercial', 'land');
CREATE TYPE property_transaction_type AS ENUM ('buy', 'rent');
CREATE TYPE property_type AS ENUM (
  'apartment', 'villa', 'independent_house', 'builder_floor',
  'penthouse', 'studio',
  'office', 'shop', 'showroom', 'warehouse', 'coworking',
  'plot', 'agricultural_land', 'farm_house'
);
CREATE TYPE property_status AS ENUM ('active', 'pending_approval', 'rejected', 'draft', 'archived');
CREATE TYPE property_furnishing AS ENUM ('furnished', 'semi_furnished', 'unfurnished');

CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'interested', 'visit_scheduled', 'visited', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE lead_source AS ENUM ('website_inquiry', 'referral', 'whatsapp', 'direct');

CREATE TYPE referral_type AS ENUM ('friend', 'property');
CREATE TYPE referral_status AS ENUM ('pending', 'registered', 'deal_closed', 'rewarded', 'expired');

CREATE TYPE wallet_transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE wallet_transaction_reason AS ENUM ('referral_reward', 'signup_bonus', 'withdrawal', 'adjustment');

CREATE TYPE document_type AS ENUM ('aadhaar', 'pan', 'property_deed', 'electricity_bill', 'tax_receipt', 'other');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE service_request_type AS ENUM ('architect', 'interior_designer', 'pg_booking', 'farmhouse_resort', 'coworking_space');
CREATE TYPE service_request_status AS ENUM ('pending', 'forwarded_to_whatsapp', 'in_progress', 'completed', 'cancelled');

CREATE TYPE tenancy_status AS ENUM ('active', 'upcoming', 'completed', 'terminated', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'partially_paid', 'failed', 'waived');
CREATE TYPE payment_method AS ENUM ('upi', 'bank_transfer', 'cash', 'cheque', 'wallet', 'other');
CREATE TYPE complaint_category AS ENUM ('maintenance', 'plumbing', 'electrical', 'pest_control', 'noise', 'security', 'cleaning', 'appliance', 'structural', 'other');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE complaint_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'closed', 'reopened');
CREATE TYPE notification_type AS ENUM ('lead_update', 'property_status', 'payment_due', 'payment_received', 'complaint_update', 'referral_update', 'system', 'welcome');

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(20),
  whatsapp_number VARCHAR(20),
  role user_role NOT NULL DEFAULT 'tenant',
  status user_status NOT NULL DEFAULT 'active',
  is_email_verified BOOLEAN DEFAULT TRUE, -- Google sign-in verifies email
  is_phone_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. LOCATION REFERENCE TABLES (States > Cities > Localities)
-- ============================================================================
-- These must be defined before profiles & properties so FKs can reference them.

CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL, -- e.g. 'RJ', 'DL', 'MH'
  is_active BOOLEAN DEFAULT TRUE,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'jaipur', 'delhi'
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE, -- show in homepage city picker
  latitude NUMERIC(10, 8),  -- city center
  longitude NUMERIC(11, 8),
  property_count INTEGER DEFAULT 0, -- denormalized for display
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(state_id, name)
);

CREATE TABLE localities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL, -- e.g. 'malviya-nagar', 'c-scheme'
  pincode VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE, -- highlight in search filters
  latitude NUMERIC(10, 8),  -- locality center
  longitude NUMERIC(11, 8),
  property_count INTEGER DEFAULT 0, -- denormalized for display
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, name),
  UNIQUE(city_id, slug)
);

-- ============================================================================
-- 3. OWNER PROFILES & VERIFICATION
-- ============================================================================

CREATE TABLE owner_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  address TEXT,
  city_id UUID REFERENCES cities(id),
  state_id UUID REFERENCES states(id),
  pincode VARCHAR(10),

  -- Bank details for rent payouts
  bank_account_name VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_ifsc_code VARCHAR(20),
  bank_name VARCHAR(255),
  upi_id VARCHAR(100),
  preferred_payout_method payment_method,

  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),

  -- Stats (denormalized)
  total_properties INTEGER DEFAULT 0,
  active_tenants INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER, -- in bytes
  status document_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2B. TENANT PROFILES
-- ============================================================================

CREATE TABLE tenant_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Personal
  date_of_birth DATE,
  gender VARCHAR(20),
  occupation VARCHAR(100),
  company_name VARCHAR(255),

  -- Current / Permanent address
  current_address TEXT,
  permanent_address TEXT,
  city_id UUID REFERENCES cities(id),
  state_id UUID REFERENCES states(id),
  pincode VARCHAR(10),

  -- Emergency contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relation VARCHAR(50),

  -- Preferences (helps with property recommendations)
  preferred_city_id UUID REFERENCES cities(id),
  preferred_budget_min NUMERIC(15, 2),
  preferred_budget_max NUMERIC(15, 2),
  preferred_property_type property_type,
  preferred_bhk SMALLINT,
  family_size SMALLINT,
  has_pets BOOLEAN DEFAULT FALSE,

  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant preferred localities (many-to-many)
CREATE TABLE tenant_preferred_localities (
  tenant_profile_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  PRIMARY KEY (tenant_profile_id, locality_id)
);

-- ============================================================================
-- 2C. ADMIN PROFILES
-- ============================================================================

CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(100), -- 'operations', 'sales', 'support', 'management'
  designation VARCHAR(100),
  permissions JSONB DEFAULT '[]'::jsonb,
  -- e.g. ["manage_properties", "manage_users", "manage_leads", "manage_payments", "view_analytics"]
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. PROPERTIES
-- ============================================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(500) UNIQUE NOT NULL, -- SEO-friendly URL slug

  -- Classification
  category property_category NOT NULL,
  transaction_type property_transaction_type NOT NULL,
  property_type property_type NOT NULL,
  status property_status NOT NULL DEFAULT 'pending_approval',

  -- Basic Info
  title VARCHAR(300) NOT NULL,
  description TEXT,
  price NUMERIC(15, 2) NOT NULL,
  price_negotiable BOOLEAN DEFAULT FALSE,

  -- For rent
  rent_deposit NUMERIC(15, 2),
  security_deposit NUMERIC(15, 2),
  maintenance_charge NUMERIC(10, 2),

  -- Specifications
  area_sqft NUMERIC(10, 2),
  carpet_area_sqft NUMERIC(10, 2),
  bedrooms SMALLINT,
  bathrooms SMALLINT,
  balconies SMALLINT,
  floor_number SMALLINT,
  total_floors SMALLINT,
  facing VARCHAR(50), -- e.g. 'North', 'South-East'
  age_of_property VARCHAR(50), -- e.g. 'Under Construction', '0-1 years', '5-10 years'
  furnishing property_furnishing,
  parking_slots SMALLINT DEFAULT 0,

  -- Location (normalized via reference tables)
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  locality_id UUID NOT NULL REFERENCES localities(id),
  city_id UUID NOT NULL REFERENCES cities(id),
  state_id UUID NOT NULL REFERENCES states(id),
  pincode VARCHAR(10),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  google_maps_url TEXT,

  -- Amenities (stored as JSONB for flexibility)
  amenities JSONB DEFAULT '[]'::jsonb,
  -- e.g. ["power_backup", "lift", "gym", "swimming_pool", "security", "cctv", "garden", "club_house"]

  -- Availability
  available_from DATE,
  possession_status VARCHAR(50), -- 'Ready to Move', 'Under Construction'

  -- Admin review
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Counts (denormalized for performance)
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE property_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) NOT NULL DEFAULT 'image', -- 'image', 'video'
  file_name VARCHAR(255),
  file_size INTEGER, -- in bytes
  sort_order SMALLINT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. LEADS MANAGEMENT
-- ============================================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- logged-in user who inquired
  source lead_source NOT NULL DEFAULT 'website_inquiry',
  status lead_status NOT NULL DEFAULT 'new',

  -- Contact info (for non-logged-in or override)
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  message TEXT,

  -- Assignment
  assigned_to UUID REFERENCES users(id), -- admin who handles this lead
  assigned_at TIMESTAMPTZ,

  -- Follow-up
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  performed_by UUID NOT NULL REFERENCES users(id),
  old_status lead_status,
  new_status lead_status,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. REFERRAL PROGRAM
-- ============================================================================

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_type referral_type NOT NULL,
  status referral_status NOT NULL DEFAULT 'pending',

  -- Refer a Friend
  referred_phone VARCHAR(20), -- WhatsApp number of referred person
  referred_user_id UUID REFERENCES users(id), -- linked once they register

  -- Refer a Property
  property_category property_category,
  property_type property_type,
  owner_contact_number VARCHAR(20),
  property_location TEXT,
  property_notes TEXT,

  -- Reward tracking
  reward_amount NUMERIC(10, 2),
  rewarded_at TIMESTAMPTZ,

  -- Linked property (once onboarded from referral)
  linked_property_id UUID REFERENCES properties(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE referral_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) NOT NULL DEFAULT 'image', -- 'image', 'video'
  file_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. TENANT WALLET
-- ============================================================================

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  transaction_type wallet_transaction_type NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  reason wallet_transaction_reason NOT NULL,
  description TEXT,
  reference_id UUID, -- could point to a referral or other entity
  balance_after NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. UPCOMING FEATURE SERVICE REQUESTS
-- ============================================================================

CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  request_type service_request_type NOT NULL,
  status service_request_status NOT NULL DEFAULT 'pending',

  -- Contact
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),

  -- Details
  details JSONB DEFAULT '{}'::jsonb,
  -- For PG/Farmhouse/Coworking: {"duration_type": "hourly|daily|weekly|monthly", "check_in": "...", "check_out": "..."}
  -- For Architect/Interior: {"project_type": "...", "budget_range": "...", "location": "..."}

  -- WhatsApp forwarding
  forwarded_at TIMESTAMPTZ,
  whatsapp_message_id VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. CONTACT FORM SUBMISSIONS
-- ============================================================================

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  enquiry_type VARCHAR(100), -- 'General', 'Property Inquiry', 'Partnership', etc.
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. PROPERTY FAVORITES / SAVED PROPERTIES (Tenant feature)
-- ============================================================================

CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ============================================================================
-- 10. TENANCIES (Lease Agreements - binds tenant to property)
-- ============================================================================

CREATE TABLE tenancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Lease terms
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  monthly_rent NUMERIC(15, 2) NOT NULL,
  security_deposit NUMERIC(15, 2),
  maintenance_charge NUMERIC(10, 2) DEFAULT 0,
  rent_due_day SMALLINT DEFAULT 1, -- day of month rent is due (1-28)
  lock_in_period_months SMALLINT, -- e.g. 6 months, 11 months
  notice_period_days SMALLINT DEFAULT 30,
  annual_increment_percent NUMERIC(4, 2), -- e.g. 5.00 = 5%

  -- Agreement document
  agreement_document_url TEXT,
  agreement_signed_at TIMESTAMPTZ,

  -- Status
  status tenancy_status NOT NULL DEFAULT 'upcoming',
  move_in_date DATE,
  move_out_date DATE,
  termination_reason TEXT,
  terminated_by UUID REFERENCES users(id),

  -- Admin who facilitated
  managed_by UUID REFERENCES users(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. RENT PAYMENTS
-- ============================================================================

CREATE TABLE rent_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenancy_id UUID NOT NULL REFERENCES tenancies(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES users(id),
  owner_id UUID NOT NULL REFERENCES users(id),

  -- What this payment is for
  payment_for_month DATE NOT NULL, -- first of the month, e.g. 2026-02-01
  amount_due NUMERIC(15, 2) NOT NULL,
  amount_paid NUMERIC(15, 2) DEFAULT 0,
  late_fee NUMERIC(10, 2) DEFAULT 0,
  total_due NUMERIC(15, 2) GENERATED ALWAYS AS (amount_due + late_fee) STORED,

  -- Payment info
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  payment_date TIMESTAMPTZ,
  transaction_reference VARCHAR(255), -- UPI ref / bank ref / cheque no
  receipt_url TEXT, -- generated PDF receipt

  -- Payout to owner
  payout_status payment_status DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  payout_reference VARCHAR(255),

  due_date DATE NOT NULL,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 12. SECURITY DEPOSIT TRACKING
-- ============================================================================

CREATE TABLE security_deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenancy_id UUID NOT NULL REFERENCES tenancies(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES users(id),
  owner_id UUID NOT NULL REFERENCES users(id),

  amount NUMERIC(15, 2) NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method payment_method,
  transaction_reference VARCHAR(255),

  -- Refund at end of tenancy
  is_refunded BOOLEAN DEFAULT FALSE,
  refund_amount NUMERIC(15, 2),
  deductions NUMERIC(15, 2) DEFAULT 0,
  deduction_reason TEXT,
  refunded_at TIMESTAMPTZ,
  refund_reference VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 13. COMPLAINTS / MAINTENANCE REQUESTS
-- ============================================================================

CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenancy_id UUID REFERENCES tenancies(id) ON DELETE SET NULL,
  property_id UUID NOT NULL REFERENCES properties(id),
  raised_by UUID NOT NULL REFERENCES users(id), -- tenant
  against_property_owner UUID REFERENCES users(id), -- owner (auto-filled from property)

  -- Complaint details
  category complaint_category NOT NULL,
  priority complaint_priority NOT NULL DEFAULT 'medium',
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]'::jsonb, -- photos/videos of the issue

  -- Status tracking
  status complaint_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES users(id), -- admin or maintenance person

  -- Resolution
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  satisfaction_rating SMALLINT, -- 1-5 from tenant after resolution

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE complaint_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  comment TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 14. NOTIFICATIONS (All user types)
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  title VARCHAR(300) NOT NULL,
  message TEXT NOT NULL,
  entity_type VARCHAR(50), -- 'property', 'lead', 'payment', 'complaint', 'referral'
  entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 15. ADMIN ACTIVITY LOG
-- ============================================================================

CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- e.g. 'approve_property', 'suspend_user', 'assign_lead'
  entity_type VARCHAR(50), -- 'property', 'user', 'lead'
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_phone ON users(phone);

-- Sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- States / Cities / Localities
CREATE INDEX idx_cities_state_id ON cities(state_id);
CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_is_active ON cities(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_localities_city_id ON localities(city_id);
CREATE INDEX idx_localities_slug ON localities(city_id, slug);
CREATE INDEX idx_localities_is_active ON localities(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_localities_is_popular ON localities(city_id, is_popular) WHERE is_popular = TRUE;

-- Tenant Preferred Localities
CREATE INDEX idx_tenant_pref_localities_tenant ON tenant_preferred_localities(tenant_profile_id);
CREATE INDEX idx_tenant_pref_localities_locality ON tenant_preferred_localities(locality_id);

-- Owner Profiles
CREATE INDEX idx_owner_profiles_user_id ON owner_profiles(user_id);

-- Documents
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Properties (critical for search & filtering)
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_city_id ON properties(city_id);
CREATE INDEX idx_properties_locality_id ON properties(locality_id);
CREATE INDEX idx_properties_state_id ON properties(state_id);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_properties_slug ON properties(slug);

-- Composite indexes for common search patterns
CREATE INDEX idx_properties_search ON properties(status, category, transaction_type, city_id);
CREATE INDEX idx_properties_price_range ON properties(status, price) WHERE status = 'active';
CREATE INDEX idx_properties_location ON properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Property Media
CREATE INDEX idx_property_media_property_id ON property_media(property_id);

-- Leads
CREATE INDEX idx_leads_property_id ON leads(property_id);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_source ON leads(source);

-- Lead Activities
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);

-- Referrals
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_type ON referrals(referral_type);

-- Wallets
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

-- Service Requests
CREATE INDEX idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX idx_service_requests_type ON service_requests(request_type);
CREATE INDEX idx_service_requests_status ON service_requests(status);

-- Contact Submissions
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Saved Properties
CREATE INDEX idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX idx_saved_properties_property_id ON saved_properties(property_id);

-- Tenant Profiles
CREATE INDEX idx_tenant_profiles_user_id ON tenant_profiles(user_id);

-- Admin Profiles
CREATE INDEX idx_admin_profiles_user_id ON admin_profiles(user_id);

-- Tenancies
CREATE INDEX idx_tenancies_property_id ON tenancies(property_id);
CREATE INDEX idx_tenancies_tenant_id ON tenancies(tenant_id);
CREATE INDEX idx_tenancies_owner_id ON tenancies(owner_id);
CREATE INDEX idx_tenancies_status ON tenancies(status);
CREATE INDEX idx_tenancies_lease_dates ON tenancies(lease_start_date, lease_end_date);
CREATE INDEX idx_tenancies_active ON tenancies(tenant_id, status) WHERE status = 'active';

-- Rent Payments
CREATE INDEX idx_rent_payments_tenancy_id ON rent_payments(tenancy_id);
CREATE INDEX idx_rent_payments_tenant_id ON rent_payments(tenant_id);
CREATE INDEX idx_rent_payments_owner_id ON rent_payments(owner_id);
CREATE INDEX idx_rent_payments_status ON rent_payments(status);
CREATE INDEX idx_rent_payments_due_date ON rent_payments(due_date);
CREATE INDEX idx_rent_payments_month ON rent_payments(payment_for_month);
CREATE INDEX idx_rent_payments_overdue ON rent_payments(status, due_date) WHERE status IN ('pending', 'overdue');
CREATE INDEX idx_rent_payments_payout ON rent_payments(payout_status) WHERE payout_status = 'pending' AND status = 'paid';

-- Security Deposits
CREATE INDEX idx_security_deposits_tenancy_id ON security_deposits(tenancy_id);
CREATE INDEX idx_security_deposits_tenant_id ON security_deposits(tenant_id);

-- Complaints
CREATE INDEX idx_complaints_tenancy_id ON complaints(tenancy_id);
CREATE INDEX idx_complaints_property_id ON complaints(property_id);
CREATE INDEX idx_complaints_raised_by ON complaints(raised_by);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX idx_complaints_open ON complaints(status, priority) WHERE status NOT IN ('resolved', 'closed');

-- Complaint Comments
CREATE INDEX idx_complaint_comments_complaint_id ON complaint_comments(complaint_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Admin Activity Log
CREATE INDEX idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_log_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);

-- ============================================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cities_updated_at
  BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_localities_updated_at
  BEFORE UPDATE ON localities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_owner_profiles_updated_at
  BEFORE UPDATE ON owner_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_referrals_updated_at
  BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_wallets_updated_at
  BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_service_requests_updated_at
  BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_tenant_profiles_updated_at
  BEFORE UPDATE ON tenant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_tenancies_updated_at
  BEFORE UPDATE ON tenancies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_rent_payments_updated_at
  BEFORE UPDATE ON rent_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_security_deposits_updated_at
  BEFORE UPDATE ON security_deposits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_complaints_updated_at
  BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: Auto-create wallet when a tenant user is created
-- ============================================================================

CREATE OR REPLACE FUNCTION create_wallet_for_tenant()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'tenant' THEN
    INSERT INTO wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_wallet_on_user_insert
  AFTER INSERT ON users FOR EACH ROW EXECUTE FUNCTION create_wallet_for_tenant();
