SELECT * FROM company_db.employee;

SELECT T1.id, T1.first_name, T1.last_name, title, salary, department, CONCAT(T1.first_name, '   ', T1.last_name) AS manager
FROM employee T1
LEFT JOIN roles ON T1.role_id = roles.id_ro
LEFT JOIN departments ON roles.department_id = departments.id_de;



SELECT  first_name, last_name FROM company_db.employee;


