INSERT INTO department (name) VALUES 
('Sales'), 
('Engineering'),
('Marketing'), 
('Legal');

INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead', 100000, 1), 
('Software Engineer', 120000, 2),
('Social Media Manager', 90000, 3),
('Legal Advisor', 110000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Suzet', 'Salinas', 1, NULL),
('Jane', 'Doe', 2, 1),
('John', 'Green', 3, 1),
('Hank', 'Green', 4, 2),
('Bobby', 'Brown', 1, 2),