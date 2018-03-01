module.exports = {
    get: (req,res,next) => {
        const {userID} = req.params;
        const db = req.app.get('db');
        db.get_user([userID]).then(users => {
            //Get Skills for user
            db.get_skills([userID]).then(skills => {
                users[0].skills = skills
                res.status(200).send(users[0]);
            }).catch(err => console.log('Error getting user skills', err))
        }).catch( err => {
            console.log(err);
            res.status(500).send('Oops, something went wrong!')
        })
    },

    update: (req, res, next) => {
        const {id} = req.params;
        const {first_name, last_name, bio, email, location, portfolio, website, github, bitbucket, gitlab, codepen, twitter, picture} = req.body;

        const dbInstance = req.app.get('db')
            dbInstance.edit_user([id, first_name, last_name, bio, email.value, location.value, portfolio.value, website.value, github.value, bitbucket.value, gitlab.value, codepen.value, twitter.value, email.public, location.public, portfolio.public, website.public, github.public, bitbucket.public, gitlab.public, codepen.public, twitter.public, picture])
            .then( x => {
                console.log(x);
                res.status(200).send('Updated')
            }).catch( err => {
                console.log('Error updating user info: ', err);
                res.status(500).send('Oops, something went wrong!')
            })

    },
    delete: (req, res, next) => {
        console.log('connect country')
        const dbInstance = req.app.get('db')
        dbInstance.delete_user([req.params.id]).then(entry=>{
            res.status(200).send(entry)
        }).catch(error => {
            console.error(error);
            res.status(500).send(err);
        })
    },

    addSkill: (req,res,next) => {
        const {user_id, skill, level} = req.body;
        const db = req.app.get('db');
        db.add_user_skill([user_id, skill, level]).then( skills => {
            console.log("skill added");
            res.status(200).send(skills[0]);
        }).catch(err => {
            console.log('Error adding skill:', err);
            res.status(500).send('Oops, something went wrong');
        })
    },

    deleteSkill: (req,res,next) => {
        const {id} = req.params;
        const db = req.app.get('db');
        db.delete_user_skill([id]).then( () => {
            res.status(200).send('Skill Removed');
        }).catch(err => {
            console.log('Error removing skill:', err);
            res.status(500).send('Oops, something went wrong');
        })
    },

}
