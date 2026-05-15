-- Clean up existing tables to ensure a fresh start
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS service_projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations CASCADE;

-- Organizations Table
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    contact_email VARCHAR(255),
    logo_filename VARCHAR(255)
);

-- Service Projects Table
CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    project_date DATE
);

-- Categories Table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Junction Table for Many-to-Many relationship (Projects <-> Categories)
CREATE TABLE project_categories (
    project_id INTEGER REFERENCES service_projects(project_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Seed Data: Organizations
INSERT INTO organizations (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Seed Data: Categories
INSERT INTO categories (category_name) VALUES 
('Environmental'), 
('Education'), 
('Health'), 
('Community');

-- Seed Data: Projects for BrightFuture (ID 1)
INSERT INTO service_projects (organization_id, title, description, location, project_date) VALUES
(1, 'Sustainable Housing', 'Building eco-homes.', 'Downtown', '2026-10-10'),
(1, 'Solar School', 'Solar energy for schools.', 'West', '2026-10-25'),
(1, 'Bridge Repair', 'Fixing wooden bridge.', 'River', '2026-11-05'),
(1, 'Green Roofs', 'Vegetation on rooftops.', 'Center', '2026-11-15'),
(1, 'Recycled Benches', 'Benches from waste.', 'Park', '2026-12-01');

-- Seed Data: Projects for GreenHarvest (ID 2)
INSERT INTO service_projects (organization_id, title, description, location, project_date) VALUES
(2, 'Urban Garden', 'Shared neighborhood garden.', 'East', '2026-09-20'),
(2, 'Compost Class', 'Organic waste workshop.', 'Hall', '2026-10-12'),
(2, 'Fruit Orchard', 'Planting fruit trees.', 'South', '2026-10-30'),
(2, 'Hydroponics Lab', 'Vertical farming.', 'Tech Center', '2026-11-20'),
(2, 'Seed Exchange', 'Trading organic seeds.', 'Plaza', '2026-12-05');

-- Seed Data: Projects for UnityServe (ID 3)
INSERT INTO service_projects (organization_id, title, description, location, project_date) VALUES
(3, 'Senior Tech', 'Elders with digital tools.', 'Rest Home', '2026-09-15'),
(3, 'English Class', 'Language for immigrants.', 'Library', '2026-10-05'),
(3, 'Food Drive', 'Collecting food.', 'Unity Center', '2026-10-20'),
(3, 'Mentorship', 'Guidance for youth.', 'Youth Club', '2026-11-10'),
(3, 'Community Mural', 'Painting with artists.', 'Art Alley', '2026-12-10');

-- Assigning Categories to Projects (1:Env, 2:Edu, 3:Health, 4:Comm)
INSERT INTO project_categories (project_id, category_id) VALUES 
(1,1), (2,1), (3,4), (4,1), (5,1), -- BrightFuture projects
(6,1), (7,1), (8,1), (9,2), (10,4), -- GreenHarvest projects
(11,2), (12,2), (13,4), (14,2), (15,4); -- UnityServe projects