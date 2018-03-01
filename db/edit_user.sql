UPDATE users SET first_name = $2, last_name = $3, bio = $4, email = $5, location = $6, portfolio = $7, website = $8, github = $9, bitbucket = $10, gitlab = $11, codepen = $12, twitter = $13, email_public = $14, location_public = $15, portfolio_public = $16, website_public = $17, github_public = $18, bitbucket_public = $19, gitlab_public = $20, codepen_public = $21, twitter_public = $22, picture = $23
WHERE id = $1

RETURNING *;
