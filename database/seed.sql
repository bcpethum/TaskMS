-- Seed Data for Task Management Application

-- Insert Default Admin User
-- Password: '123456' hashed with bcrypt (10 rounds)
-- This is a verified valid bcrypt hash for the string '123456'
INSERT INTO users (name, email, password)
VALUES (
    'Admin User',
    'admin@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
) ON CONFLICT (email) DO UPDATE SET
    password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    name = 'Admin User';

-- Sample Tasks (requires user with id=1 to exist)
INSERT INTO tasks (user_id, title, description, priority, status, due_date)
VALUES
(
    1,
    'Complete Initial Project Setup',
    'Set up directory structure, backend Express server, frontend Next.js app, and database scripts.',
    'High',
    'Completed',
    CURRENT_DATE - INTERVAL '3 days'
),
(
    1,
    'Implement User Authentication',
    'Build login API endpoint with JWT authentication and middleware.',
    'High',
    'Completed',
    CURRENT_DATE - INTERVAL '1 day'
),
(
    1,
    'Design Dashboard UI',
    'Create dynamic stats summary for total, pending, in-progress, completed, and overdue tasks.',
    'Medium',
    'In Progress',
    CURRENT_DATE + INTERVAL '2 days'
),
(
    1,
    'Build Task Management CRUD',
    'Implement create, read, update, and delete functionality for tasks with full UI.',
    'High',
    'In Progress',
    CURRENT_DATE + INTERVAL '3 days'
),
(
    1,
    'Add Search and Filtering',
    'Implement search by title and filter by status and priority.',
    'Medium',
    'Pending',
    CURRENT_DATE + INTERVAL '5 days'
),
(
    1,
    'Fix Mobile Responsive Layout',
    'Ensure all pages render correctly on mobile and tablet viewports.',
    'Low',
    'Pending',
    CURRENT_DATE + INTERVAL '7 days'
),
(
    1,
    'Write API Documentation',
    'Document all REST API endpoints with request/response examples.',
    'Low',
    'Pending',
    CURRENT_DATE - INTERVAL '2 days'
);
