module.exports = {
    add: (req, res, next) => {
        const db = req.app.get('db')
        db.add_contact().then(posts=> {
            res.status(200).send(posts);
        }).catch(error=>{
            console.error(error);
            res.status(500).send(err);
        })
    },
    get: (req, res, next) => {
        const db = req.app.get('db')
        const {userID, friendID} = req.query;
        db.get_contacts([req.query.user_id]).then(contacts=> {
            // db.get_contacts2([req.query.user_id]).then(altContacts => {
            //     altContacts.forEach( c => {
            //         contacts.push(c)
            //     });
            // }).catch(error => {
            //     console.error(error);
            //     res.status(500).send(error)
            // })
            res.status(200).send(contacts)
        }).catch(error => {
            console.error(error);
            res.status(500).send(error)
        })
    },

    connect: (req, res, next) => {
        const db = req.app.get('db')
        const {userID, connectWith} = req.body;
        console.log(userID, connectWith)
        db.connect_with_user([userID, connectWith]).then(contacts => {
            res.status(200).send('Connected');
        }).catch(error=>{
            console.error(error);
            res.status(500).send(error);
        })
    },

    check: (req, res, next) => {
        const db = req.app.get('db')
        const {userID, friendID} = req.query;
        db.check_for_existing_contact([userID, friendID]).then(contacts => {
            if(contacts.length){
                res.status(200).send(true);
            } else {
                res.status(200).send(false);
            }

        }).catch(error=>{
            console.error(error);
            res.status(500).send(error);
        })
    },

}
