SELECT T1.id, CONCAT(T2.first_name, ' ', T2.last_name) AS manager 
FROM employee T1 
LEFT JOIN employee T2 ON T1.manager_id = T2.id