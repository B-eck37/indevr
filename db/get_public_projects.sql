SELECT * FROM projects JOIN project_stacks ON projects.id=project_stacks.project_id 
WHERE public=true AND projects.user_id<>$1;
