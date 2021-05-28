SELECT * FROM company_db.employee;
-- if is manager
UPDATE employee
SET manager_id = null
WHERE employee.manager_id = 9;



DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = "David Monteleone";
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Belinda", "D'Apice", 2, 1);

-- if not manager
DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = "Adam Weaver";

SELECT * FROM company_db.employee;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Adam", "Weaver", 10, 9);
SELECT * FROM company_db.employee;


