USE company_DB;

INSERT INTO department (name)
VALUES ("Sales"),("Engineering"),("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Manager", 100000, 1),("Sales Representative", 70000, 1),
("Engineering Manager", 120000, 2),("Software Engineer", 80000, 2),
("Finance Manager", 100000, 3),("Accountant", 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brenton", "Cole", 1, NULL),("Sarah", "Hamid", 2, 1),
("David", "Impey", 3, NULL),("Zhou", "Tian", 4, 3),
("Ross", "Giorgio", 5, NULL),("Darren", "Qi", 6, 5);
