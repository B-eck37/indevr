SELECT * FROM skills WHERE LOWER(skills.skill) LIKE '%' || LOWER($1) || '%';