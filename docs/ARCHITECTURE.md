# AppWeave: Modular Multi-App SaaS Ecosystem
**Hackathon:** ArchScale Guild — Intern Technology Hackathon  
**Problem Statement:** AS-06 — Build a modular app ecosystem that works as one  

---

## Executive Summary
Architecture, interior design, and construction firms face severe operational fragmentation. **AppWeave** demonstrates an enterprise-grade **Modular Multi-App SaaS Ecosystem** uniting three mission-critical domains:
1. **Projects Module (Electric Blue)**: Client project delivery, milestone progression, and commercial scopes.
2. **Documents Module (Warm Amber)**: Centralized Supabase CAD/BIM drawing vault, version control, and auto-provisioned project folders.
3. **HR & Teams Module (Royal Purple)**: Specialist design roster, architectural skill tracking, and cross-project staffing allocations.

All three modules operate upon a **Shared Platform Core** with **One Identity**, a **Subscription Entitlements Engine**, **Zero Data Duplication**, and a **Live Cross-App Realtime Event Bus**.

```
                           +-------------------------------------+
                           |            ONE IDENTITY             |
                           |   Supabase Auth / Single Profile    |
                           +------------------+------------------+
                                              |
                                              v
                           +-------------------------------------+
                           |      APP ENTITLEMENTS ENGINE        |
                           |  Org Subscription (Basic / Enterp.) |
                           +------------------+------------------+
                                              |
            +---------------------------------+---------------------------------+
            |                                 |                                 |
            v                                 v                                 v
   +-------------------+             +-------------------+             +-------------------+
   |  PROJECTS MODULE  |             | DOCUMENTS MODULE  |             |    HR MODULE      |
   | (Electric Blue)   |             |  (Warm Amber)     |             |  (Royal Purple)   |
   +---------+---------+             +---------+---------+             +---------+---------+
             |                                 |                                 |
             |                                 |                                 |
             +--------------------> [REALTIME EVENT BUS] <-----------------------+
                           (e.g., PROJECT_CREATED auto-creates
                            folder in Docs & alerts HR staffing)
                                              |
                                              v
                           +-------------------------------------+
                           |         SHARED PLATFORM CORE        |
                           |  - Multi-tenant Orgs (RLS)          |
                           |  - Shared Contacts (Clients & Staff)|
                           |  - Notifications & Realtime Bell    |
                           |  - Audit Trail & Storage Bucket     |
                           +-------------------------------------+
```

---

## 1. The Real Problem: Fragmented Architecture & Construction Stacks

Traditional architecture and interior design studios juggle between 5 to 10 disconnected point solutions:
- **Project Tracking:** Asana, Monday.com, or ClickUp
- **Asset Storage:** Google Drive, Dropbox, or Autodesk Construction Cloud
- **HR & Staffing:** BambooHR, Gusto, or bespoke Excel spreadsheets
- **Client Invoicing & Contacts:** QuickBooks, FreshBooks, or HubSpot
- **Technical Blueprints:** BIM 360, Revit server, Local NAS

### The Consequences:
1. **Data Desynchronization & Drift:** A client changes contact details in billing, but project managers still email outdated addresses.
2. **Double Entry & Duplication:** When an employee joins the firm, their credentials and records must be hand-copied into Asana, Google Drive access groups, and HR software.
3. **Blind Resource Planning:** HR cannot view active milestone deadlines when scheduling architect allocations, causing severe staffing bottlenecks.
4. **Permit & Blueprint Errors:** Document folders are manually created with naming errors, leading to contractors building against outdated drawing revisions.

AppWeave solves this by combining the **autonomy of domain-specific apps** with the **cohesion of a unified core**.

---

## 2. Decision: Modular Monolith over Microservices

### Why We Chose a Modular Monolith:
| Metric | Microservices | Modular Monolith (AppWeave) |
|---|---|---|
| **Data Consistency** | Eventual consistency, distributed sagas, 2-phase commits | Immediate ACID consistency across shared core tables |
| **Cross-Domain Queries** | Network hops, GraphQL federation, latency overhead | Single database query joins `contacts` to `employees` to `assignments` |
| **Deployment Complexity** | Multiple Kubernetes pods, service meshes, CI/CD pipelines | Single atomic deployment to Vercel + Supabase |
| **Authentication & AuthZ** | Token exchange, distributed JWT validation per service | Single Supabase Auth session with JWT entitlement payload |
| **Developer Velocity** | High overhead for seed/growth teams | Instant end-to-end TypeScript types across domain boundaries |

### The Extraction Guarantee:
Because AppWeave strictly enforces modular domain boundaries:
- `/app/apps/projects` only interacts with Projects API & types.
- `/app/apps/documents` only interacts with Documents API & types.
- `/app/apps/hr` only interacts with HR API & types.
- Cross-module communication occurs exclusively via the **Platform Event Bus** (`lib/events`) or **Shared Platform Core** (`lib/store`).
If any single app requires independent scaling in the future, its directory can be excised into an independent microservice with zero changes to its internal domain logic.

---

## 3. Platform Core vs. App Modules Boundary Decision

To avoid spaghetti code, AppWeave adheres to strict architectural boundary criteria:

### Platform Core (Shared Foundation):
- **Identity & Authentication:** Single Supabase Auth user table, JWT validation, session persistence.
- **Multi-Tenancy & Orgs:** `organizations` table, row-level security (RLS) enforcement.
- **Entitlements Engine:** Matrix mapping `org_id` to entitled `app_slug`s (`projects`, `documents`, `hr`).
- **Shared Contacts Table:** Single record repository for `client`, `employee`, and `vendor`. Both Projects and HR reference `contact_id`.
- **Event Bus:** Event publishing and subscription engine connecting real-time updates across apps.
- **Audit Logging:** Platform-wide compliance tracking.

### Domain App Modules (Isolated Workspaces):
- **Projects App:**
  - Entities: `projects`, `milestones`, `project_members`
  - Responsibilities: Milestone completion status, project budgeting, scope briefs.
- **Documents App:**
  - Entities: `folders`, `documents`
  - Responsibilities: CAD/DWG versioning, Supabase Storage uploads, folder hierarchy.
- **HR & Teams App:**
  - Entities: `employees`, `assignments`
  - Responsibilities: Architectural specialties, designation levels, project staffing allocations.

---

## 4. Live Cross-App Realtime Event Flow

```
[ User in Projects App ]
         |
         | 1. Submits "Skyline Penthouse"
         v
[ API: POST /api/projects ]
         |
         | 2. Inserts Project into 'projects' table
         | 3. Writes event to 'events' table:
         |    { type: 'PROJECT_CREATED', payload: { project_id, name, org_id } }
         v
[ Supabase Realtime / Event Bus ]
         |
         +---------------------------------------+
         |                                       |
         v (Listener 1)                          v (Listener 2)
[ Documents Module ]                     [ HR Module ]
- Catches 'PROJECT_CREATED'              - Catches 'PROJECT_CREATED'
- Auto-creates folder:                   - Shows real-time toast:
  /projects/{project_name}/              - "New project created — assign team"
- Auto-provisions 'Blueprints' &         - Displays 1-click allocation modal
  'Specifications' subfolders
```

---

## 5. AI Usage: How Cursor / Claude / Gemini Accelerated AppWeave

1. **Domain Modeling:** Used AI to architect the zero-duplication database schema linking `contacts`, `employees`, and `projects`.
2. **Idempotent RLS Policies:** Generated PostgreSQL Row Level Security rules isolating tenant data while enabling cross-module joins.
3. **Design System & HSL Tokens:** Crafted high-contrast dark-mode color identities for each app (Electric Blue, Warm Amber, Royal Purple) with glassmorphism.
4. **Dual-Mode Sync:** Developed a resilient dual-mode state store that connects to live Supabase Postgres/Realtime when credentials are provided, or seamlessly falls back to pre-seeded mock memory state for immediate evaluation.

---

## 6. What We Would Build Next (Product Roadmap)

1. **Integrated Stripe Billing:** Automated subscription lifecycle management (checkout, tier upgrades from Basic to Enterprise, webhooks, and metered storage billing).
2. **Financials & Accounts Module (Teal Accent):** Architectural AIA G702/G703 billing sheets, change order tracking, and progress invoicing directly tied to completed milestones.
3. **Bidirectional Webhooks & Zapier App:** Allow external BIM software (Autodesk Revit, Rhino, Procore) to publish file commits into AppWeave's event bus.
4. **Mobile Native App (React Native / Expo):** On-site job inspections, blueprint markup with Apple Pencil, photo capture, and punch-list milestone sign-offs.
