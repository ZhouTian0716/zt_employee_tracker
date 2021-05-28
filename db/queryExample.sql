SELECT * FROM company_db.employee;

SELECT T1.id, T1.first_name, T1.last_name, CONCAT(T2.first_name, '   ', T2.last_name) AS manager
FROM employee T1, employee T2
WHERE T1.manager_id = T2.id;


SELECT  first_name, last_name FROM company_db.employee;