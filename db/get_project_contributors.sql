SELECT * FROM project_users JOIN users ON project_users.user_id=users.id WHERE project_users.project_id=$1;