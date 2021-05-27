USE company_DB;

INSERT INTO departments (department)
VALUES ("Executives"),("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Director", 200000, 1),("General Manager", 150000, 1),
("Sales Manager", 100000, 2),("Sales Representative", 60000, 2),
("Engineering Manager", 120000, 3),("Software Engineer", 80000, 3),
("Finance Manager", 100000, 4),("Accountant", 70000, 4),
("Legal Manager", 100000, 5),("Contract Administrator", 70000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ross", "Giorgio", 1, NULL), ("Belinda", "D'Apice", 2, 1),
("Brenton", "Cole", 3, 2),("Sarah", "Hamid", 4, 3),
("David", "Impey", 5, 2),("Zhou", "Tian", 6, 5),
("Martin", "Giorgio", 7, 2),("Darren", "Qi", 8, 7),
("David", "Monteleone", 9, 2),("Adam", "Weaver", 10, 9);
