SELECT * FROM company_db.employee;


UPDATE employee
SET role_id = 6, manager_id = 9
WHERE CONCAT(first_name, ' ', last_name) = "Ross Giorgio";
SELECT T1.id, T1.first_name, T1.last_name, roles.title, roles.salary, departments.department, CONCAT(T2.first_name, '   ', T2.last_name) AS manager
FROM employee T1
LEFT JOIN roles ON T1.role_id = roles.id_ro
LEFT JOIN departments ON roles.department_id = departments.id_de
LEFT JOIN employee T2 ON T1.manager_id = T2.id;




SELECT T1.id, T1.first_name, T1.last_name, roles.title, roles.salary, departments.department, CONCAT(T2.first_name, ' ', T2.last_name) AS manager
FROM employee T1
LEFT JOIN roles ON T1.role_id = roles.id_ro
LEFT JOIN departments ON roles.department_id = departments.id_de
LEFT JOIN employee T2 ON T1.manager_id = T2.id;


SELECT  first_name, last_name FROM company_db.employee;


