# AppWeave 🏗️

> **Hackathon:** ArchScale Guild — Intern Technology Hackathon  
> **Problem Statement:** AS-06 — Build a modular app ecosystem that works as one  
> **Target Industry:** Architecture, Interior Design & Construction Firms  

---

## 🌟 What is AppWeave?

AppWeave is a **Modular Multi-App SaaS Ecosystem prototype** that unifies three mission-critical domains into one seamless operating system:

1. **Projects Module (Electric Blue)** — Client project commissions, delivery tracking, milestones, and commercial budgets.
2. **Documents Module (Warm Amber)** — Centralized Supabase CAD/BIM drawing vault, drawing versioning, and auto-provisioned project folders.
3. **HR & Teams Module (Royal Purple)** — Specialist architect roster, skills matrix, and cross-project staffing allocations.

---

## ⚡ The 6 Core Architectural Principles (All Fully Working)

1. **One Identity:**
   - Single Supabase Auth login.
   - One user profile shared across all apps without re-authentication.
   - JWT session payload carries entitlement claims.

2. **App Entitlements Engine:**
   - Organization subscription plan controls app visibility and access.
   - **Org A ("Studio One"):** Basic Plan → **Projects Only**. Documents & HR show locked badges and redirect to `/upgrade`.
   - **Org B ("DesignHouse"):** Enterprise Plan → **Projects + Documents + HR**.
   - Admin settings page at `/settings/entitlements` allows dynamic live toggling!

3. **Shared Platform Core:**
   - Auth (Supabase Auth)
   - Multi-tenant Organizations with PostgreSQL RLS
   - Shared Contacts directory (Clients, Employees, Vendors)
   - Real-time Notifications Bell with live unread counter
   - Immutable Platform Audit Trail (`/settings/audit`)

4. **Live Cross-App Event Flow (Demo this live!):**
   - User creates a new Project in the Projects app.
   - Dispatches `PROJECT_CREATED` to the event bus.
   - **Documents module listener:** Auto-creates folder `/projects/{project_name}/` with subfolders for Blueprints & Specs.
   - **HR module listener:** Auto-suggests team assignment + displays live interactive toast!

5. **Shared Data Without Duplication:**
   - Employee record in HR links to the shared `contacts` table (`contact_id`).
   - The same employee record is displayed in the Projects team tab without copy-pasting data.

6. **Modular Monolith Architecture:**
   - Built on **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.
   - Clean folder separation per module (`/app/apps/projects`, `/app/apps/documents`, `/app/apps/hr`, `/app/platform`).

---

## 🚀 Quick Start (Running Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!TIP]
> **Zero-Friction Dual-Mode Setup:**
> AppWeave has a built-in embedded state engine pre-seeded with Org A and Org B. It runs immediately out-of-the-box!
> To connect your live Supabase project, simply add your credentials to `.env.local` and execute `supabase/schema.sql` and `supabase/seed.sql` in your Supabase SQL Editor.

---

## 🔑 Hackathon Demo Credentials

Use the **1-Click Persona Switcher** on the `/login` page or top navigation bar:

| Scenario | Organization | Email | Password | Entitled Modules |
|---|---|---|---|---|
| **Scenario 1 (Single App)** | Studio One Architecture | `admin@studioone.com` | `password123` | **Projects Only** (Docs & HR locked) |
| **Scenario 2 (Multi App)** | DesignHouse Interiors | `admin@designhouse.com` | `password123` | **Projects + Documents + HR** |

---

## 🎬 Demo Scenarios Walkthrough (For Judges)

### Scenario 1 — Single App Customer:
1. Login as **Studio One** (`admin@studioone.com`).
2. Notice the sidebar: **Projects** is unlocked, while **Documents** and **HR** show lock icons.
3. Click **Documents** or **HR**: You are immediately redirected to the `/upgrade` page explaining why the app is locked.

### Scenario 2 — Multi App Customer & Live Cross-App Event:
1. Switch to **DesignHouse** (`admin@designhouse.com`) using the top quick switch bar.
2. All 3 apps are unlocked with their respective brand accents (Blue, Amber, Purple).
3. Click **"New Project"** on the dashboard or in Projects app:
   - Create project: `"Skyline Luxury Tower"`.
   - **WATCH THE SCREEN:** Real-time toast immediately fires:  
     `⚡ Cross-App Event Fired! Project created → Documents folder auto-provisioned → HR module suggests team assignment.`
4. Navigate to **Documents**: Folder `/projects/Skyline Luxury Tower/` has been auto-created!
5. Navigate to **Projects / Skyline Luxury Tower / Team Tab**: Click "Assign Staff Member" and link an architect from HR.

### Scenario 3 — One Identity & Zero Data Duplication:
1. Notice the top navbar avatar and profile: **Elena Rostova (Admin)**.
2. Navigate between Projects, Documents, and HR: identity is preserved across all apps without re-login.
3. Navigate to **HR Module**: View Elena Rostova's employee profile. Her active project allocations list the project assigned in step 2. Zero data was duplicated!

---

## 📁 Repository Structure

```
AppWeave
├── app/
│   ├── (auth)/login/page.tsx               # One Identity Login & Demo Personas
│   ├── dashboard/page.tsx                  # Unified Dashboard (Entitlement-Aware)
│   ├── apps/
│   │   ├── projects/                       # Projects Module (Blue)
│   │   │   ├── page.tsx                    # Project roster & KPI stats
│   │   │   └── [id]/page.tsx               # Overview, Milestones, HR Team tab
│   │   ├── documents/                      # Documents Module (Amber)
│   │   │   ├── page.tsx                    # CAD/BIM folder tree & file upload
│   │   │   └── [project_id]/page.tsx       # Auto-created project folder view
│   │   └── hr/                             # HR & Teams Module (Purple)
│   │       ├── page.tsx                    # Staff directory & department filter
│   │       └── [id]/page.tsx               # Employee detail & project allocations
│   ├── upgrade/page.tsx                    # Entitlement Gate & Upgrade prompt
│   ├── settings/
│   │   ├── entitlements/page.tsx           # Live Admin Entitlements Switcher
│   │   └── audit/page.tsx                  # Immutable Platform Audit Trail
│   └── api/                                # Modular API routes per domain
├── components/
│   └── platform/                           # Navbar, Sidebar, AppSwitcher, NotificationBell, EventToast
├── lib/
│   ├── store/                              # Dual-mode state store & initial seed
│   ├── events/                             # Cross-App Event Bus (Supabase Realtime)
│   ├── entitlements/                       # App catalog & permission guards
│   └── supabase/                           # Client, Server, and SSR helpers
├── types/                                  # Strict TypeScript domain schemas
├── supabase/
│   ├── schema.sql                          # Complete PostgreSQL schema with RLS
│   └── seed.sql                            # Production-ready seed data
└── docs/
    └── ARCHITECTURE.md                     # Deep technical write-up
```

---

## 🚢 Deployment to Vercel

1. Push this repository to GitHub.
2. Import project into Vercel.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**.

---

Designed and crafted for **ArchScale Guild — Intern Technology Hackathon AS-06**.
