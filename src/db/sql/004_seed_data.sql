BEGIN;

INSERT INTO departments (name, description)
VALUES
  ('Computer Engineering', 'Research in software, artificial intelligence, and computer systems.'),
  ('Electrical Engineering', 'Research in electronics, energy systems, and communications.'),
  ('Mechanical Engineering', 'Research in robotics, manufacturing, and thermal systems.');

INSERT INTO researchers (first_name, last_name, email, department_id)
VALUES
  (
    'Ayse',
    'Yilmaz',
    'ayse.yilmaz@university.edu',
    (SELECT id FROM departments WHERE name = 'Computer Engineering')
  ),
  (
    'Mehmet',
    'Kaya',
    'mehmet.kaya@university.edu',
    (SELECT id FROM departments WHERE name = 'Computer Engineering')
  ),
  (
    'Elif',
    'Demir',
    'elif.demir@university.edu',
    (SELECT id FROM departments WHERE name = 'Electrical Engineering')
  ),
  (
    'Can',
    'Aydin',
    'can.aydin@university.edu',
    (SELECT id FROM departments WHERE name = 'Electrical Engineering')
  ),
  (
    'Zeynep',
    'Celik',
    'zeynep.celik@university.edu',
    (SELECT id FROM departments WHERE name = 'Mechanical Engineering')
  );

INSERT INTO projects (
  title,
  description,
  researcher_id,
  status,
  budget,
  start_date,
  end_date
)
VALUES
  (
    'AI-Based Campus Energy Optimization',
    'Developing machine learning models to reduce campus energy consumption.',
    (SELECT id FROM researchers WHERE email = 'ayse.yilmaz@university.edu'),
    'active',
    185000.00,
    '2026-01-15',
    '2026-12-31'
  ),
  (
    'Secure Academic Data Sharing Platform',
    'Building a secure platform for sharing research datasets between universities.',
    (SELECT id FROM researchers WHERE email = 'ayse.yilmaz@university.edu'),
    'planned',
    95000.00,
    '2027-02-01',
    '2027-11-30'
  ),
  (
    'Predictive Maintenance for Data Centers',
    'Predicting server equipment failures using sensor data.',
    (SELECT id FROM researchers WHERE email = 'mehmet.kaya@university.edu'),
    'completed',
    120000.00,
    '2024-03-01',
    '2025-02-28'
  ),
  (
    'Smart Grid Fault Detection',
    'Detecting electrical grid faults with real-time signal analysis.',
    (SELECT id FROM researchers WHERE email = 'elif.demir@university.edu'),
    'active',
    240000.00,
    '2025-09-01',
    '2026-10-31'
  ),
  (
    'Low-Power Wireless Sensor Network',
    'Designing energy-efficient wireless sensors for environmental monitoring.',
    (SELECT id FROM researchers WHERE email = 'elif.demir@university.edu'),
    'completed',
    78000.00,
    '2023-06-01',
    '2024-05-31'
  ),
  (
    'Solar Microgrid Control System',
    'Creating an adaptive control system for campus solar microgrids.',
    (SELECT id FROM researchers WHERE email = 'can.aydin@university.edu'),
    'planned',
    310000.00,
    '2027-01-10',
    '2028-01-09'
  ),
  (
    'Autonomous Laboratory Robot',
    'Developing a mobile robot for safe material transport in laboratories.',
    (SELECT id FROM researchers WHERE email = 'zeynep.celik@university.edu'),
    'active',
    275000.00,
    '2025-11-01',
    '2027-04-30'
  ),
  (
    'Additive Manufacturing Quality Analysis',
    'Analyzing 3D printing quality using thermal imaging data.',
    (SELECT id FROM researchers WHERE email = 'zeynep.celik@university.edu'),
    'completed',
    145000.00,
    '2024-01-15',
    '2025-08-15'
  );

COMMIT;

-- 1. List all departments.
SELECT *
FROM departments
ORDER BY name;

-- 2. List all researchers with their department names.
SELECT
  r.id,
  r.first_name,
  r.last_name,
  r.email,
  d.name AS department_name
FROM researchers r
JOIN departments d ON d.id = r.department_id
ORDER BY r.last_name, r.first_name;

-- 3. List all projects with their researcher names.
SELECT
  p.id,
  p.title,
  p.status,
  p.budget,
  r.first_name,
  r.last_name
FROM projects p
JOIN researchers r ON r.id = p.researcher_id
ORDER BY p.title;

-- 4. List active projects.
SELECT *
FROM projects
WHERE status = 'active'
ORDER BY start_date;

-- 5. List projects above a specific budget.
SELECT
  id,
  title,
  status,
  budget
FROM projects
WHERE budget > 150000.00
ORDER BY budget DESC;
