-- Seed Data for Task Management Application

-- Insert Default Admin User
-- Password is '123456' hashed with bcrypt (salt rounds = 10)
-- Hash: $2a$10$e8wF4A0O9u5qT5V5jX8dcew9V5Z/7g4P2S4k6Q.Y5J1/7X2k0W3Sa
INSERT INTO users (name, email, password)
VALUES (
    'Admin User',
    'admin@test.com',
    '$2a$10$e8wF4A0O9u5qT5V5jX8dcew9V5Z/7g4P2S4k6Q.Y5J1/7X2k0W3Sa'
) ON CONFLICT (email) DO NOTHING;

-- Sample Tasks
INSERT INTO tasks (user_id, title, description, priority, status, due_date)
VALUES 
(
    1,
    'Complete Initial Project Setup',
    'Set up directory structure, backend Express server, frontend Next.js app, and database scripts.',
    'High',
    'In Progress',
    CURRENT_DATE + INTERVAL '2 days'
),
(
    1,
    'Implement User Authentication',
    'Build login API endpoint with JWT authentication and middleware.',
    'High',
    'Pending',
    CURRENT_DATE + INTERVAL '3 days'
),
(
    1,
    'Design Dashboard UI',
    'Create dynamic stats summary for total, pending, in-progress, completed, and overdue tasks.',
    'Medium',
    'Pending',
    CURRENT_DATE + INTERVAL '5 days'
),
(
    1,
    'Fix Mobile Layout Spacing',
    'Ensure task list and filtering controls render cleanly on mobile viewports.',
    'Low',
    'Completed',
    CURRENT_DATE - INTERVAL '1 day'
);
