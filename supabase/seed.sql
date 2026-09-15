-- AppWeave Seed Data for Hackathon Demo
-- Org A (Studio One) - Projects only plan
-- Org B (DesignHouse) - Full plan (Projects + Documents + HR)

-- Clean existing data (Optional for fresh seed)
TRUNCATE TABLE assignments CASCADE;
TRUNCATE TABLE employees CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE folders CASCADE;
TRUNCATE TABLE milestones CASCADE;
TRUNCATE TABLE project_members CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE contacts CASCADE;
TRUNCATE TABLE entitlements CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- 1. Organizations
INSERT INTO organizations (id, name, plan) VALUES
('11111111-1111-1111-1111-111111111111', 'Studio One Architecture', 'basic'),
('22222222-2222-2222-2222-222222222222', 'DesignHouse Interiors & Build', 'enterprise');

-- 2. Entitlements
-- Studio One: Projects only
INSERT INTO entitlements (org_id, app_slug) VALUES
('11111111-1111-1111-1111-111111111111', 'projects');

-- DesignHouse: Projects + Documents + HR
INSERT INTO entitlements (org_id, app_slug) VALUES
('22222222-2222-2222-2222-222222222222', 'projects'),
('22222222-2222-2222-2222-222222222222', 'documents'),
('22222222-2222-2222-2222-222222222222', 'hr');

-- 3. Users (One Identity)
INSERT INTO users (id, org_id, name, email, role, avatar_url) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Alex Mercer', 'admin@studioone.com', 'Admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Elena Rostova', 'admin@designhouse.com', 'Admin', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Marcus Vance', 'marcus@designhouse.com', 'Manager', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Sophia Chen', 'sophia@designhouse.com', 'Member', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');

-- 4. Shared Contacts (Clients, Employees, Vendors)
INSERT INTO contacts (id, org_id, name, email, type, phone, company) VALUES
-- Org A Clients
('c1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Horizon Holdings LLC', 'contact@horizonholdings.com', 'client', '+1 (555) 234-5678', 'Horizon Holdings'),
-- Org B Clients
('c2222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Apex Retail Group', 'projects@apexretail.com', 'client', '+1 (555) 890-1234', 'Apex Retail Corp'),
('c2222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Lumina Real Estate', 'dev@luminarealestate.com', 'client', '+1 (555) 678-4321', 'Lumina Developments'),
-- Org B Employees (Stored in shared contacts table!)
('c2222222-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Elena Rostova', 'admin@designhouse.com', 'employee', '+1 (555) 444-1111', 'DesignHouse'),
('c2222222-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'Marcus Vance', 'marcus@designhouse.com', 'employee', '+1 (555) 444-2222', 'DesignHouse'),
('c2222222-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'Sophia Chen', 'sophia@designhouse.com', 'employee', '+1 (555) 444-3333', 'DesignHouse');

-- 5. HR Employees (Linked without data duplication)
INSERT INTO employees (id, contact_id, org_id, designation, department) VALUES
('e1111111-0000-0000-0000-000000000001', 'c2222222-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Principal Architect', 'Architecture & Concept'),
('e1111111-0000-0000-0000-000000000002', 'c2222222-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'Senior Interior Designer', 'Interior Design'),
('e1111111-0000-0000-0000-000000000003', 'c2222222-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'BIM & Structural Engineer', 'Engineering & 3D');

-- 6. Projects (Org B Demo Projects + Org A Project)
INSERT INTO projects (id, org_id, name, client_id, status, created_by, description, budget, due_date) VALUES
-- Org A Project
('p1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Modern Loft Sanctuary', 'c1111111-0000-0000-0000-000000000001', 'active', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Full residential loft conversion with minimalist raw concrete and acoustic oak paneling.', 185000.00, '2025-11-30'),
-- Org B Projects
('p2222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Villa Renovation', 'c2222222-0000-0000-0000-000000000001', 'active', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Luxury coastal villa remodel with Mediterranean travertine, custom millwork, and infinity pool pergola.', 420000.00, '2025-12-15'),
('p2222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Office Interior', 'c2222222-0000-0000-0000-000000000002', 'planning', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Next-gen biophilic tech headquarters spanning 14,000 sq.ft across 2 executive floors.', 310000.00, '2026-03-01');

-- 7. Milestones
INSERT INTO milestones (project_id, title, due_date, status) VALUES
('p2222222-0000-0000-0000-000000000001', 'Schematic Design & Moodboards', '2025-08-15', 'completed'),
('p2222222-0000-0000-0000-000000000001', '3D Photorealistic Renderings & Signoff', '2025-09-30', 'in_progress'),
('p2222222-0000-0000-0000-000000000001', 'Structural & MEP Permitting', '2025-10-20', 'pending'),
('p2222222-0000-0000-0000-000000000002', 'Site Survey & Spatial Programming', '2025-10-10', 'completed'),
('p2222222-0000-0000-0000-000000000002', 'Acoustic & Lighting Specification', '2025-11-05', 'pending');

-- 8. Project Assignments
INSERT INTO assignments (employee_id, project_id, role, start_date) VALUES
('e1111111-0000-0000-0000-000000000001', 'p2222222-0000-0000-0000-000000000001', 'Lead Architect & Client Director', '2025-07-01'),
('e1111111-0000-0000-0000-000000000002', 'p2222222-0000-0000-0000-000000000001', 'Interior Materials Specialist', '2025-07-15'),
('e1111111-0000-0000-0000-000000000003', 'p2222222-0000-0000-0000-000000000002', 'Lead BIM Coordinator', '2025-09-01');

-- 9. Documents App (Folders & Documents)
INSERT INTO folders (id, org_id, name, project_id, parent_id) VALUES
('f2222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Villa Renovation', 'p2222222-0000-0000-0000-000000000001', NULL),
('f2222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Architectural Blueprints', 'p2222222-0000-0000-0000-000000000001', 'f2222222-0000-0000-0000-000000000001'),
('f2222222-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Office Interior', 'p2222222-0000-0000-0000-000000000002', NULL);

INSERT INTO documents (folder_id, name, file_url, version, uploaded_by, file_type, size) VALUES
('f2222222-0000-0000-0000-000000000002', 'Villa_Floorplan_Revision_C.dwg', '/mock/files/villa_floorplan_c.dwg', 3, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CAD Drawing', 14500000),
('f2222222-0000-0000-0000-000000000002', 'MEP_HVAC_Routing_Specs.pdf', '/mock/files/mep_specs.pdf', 1, 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'PDF Document', 4200000),
('f2222222-0000-0000-0000-000000000003', 'Biophilic_Space_Schedule_v2.xlsx', '/mock/files/space_schedule.xlsx', 2, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Spreadsheet', 1800000);

-- 10. Audit Logs
INSERT INTO audit_logs (org_id, user_id, action, entity, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'PROJECT_CREATED', 'Project: Villa Renovation', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'FOLDER_AUTO_CREATED', 'Folder: Villa Renovation (via Realtime Event)', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'MEMBER_ASSIGNED', 'Employee Elena Rostova assigned to Villa Renovation', NOW() - INTERVAL '4 days');

-- 11. Initial Notifications
INSERT INTO notifications (user_id, message, read, created_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Welcome to AppWeave. Your multi-app ecosystem is active.', true, NOW() - INTERVAL '7 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Villa Renovation milestone "3D Renderings" due in 5 days', false, NOW() - INTERVAL '2 hours');
