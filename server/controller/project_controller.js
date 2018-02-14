module.exports = {
    getUserProj: (req, res) => {
        const db = req.app.get('db') 
        db.get_projects([req.query.user_id]).then(posts=> res.status(200).send(posts)).catch(error=>{console.error(error);res.status(500).send(err)})
    },
    getSingle: (req, res) => {
        const db = req.app.get('db') 
        // console.log(req.params.id)
        db.get_single_project([req.params.id]).then(proj=> res.status(200).send(proj)).catch(error=>{console.error(error);res.status(500).send(err)})
    },
    getSkillStack: (req, res) => {
        const db = req.app.get('db') 
        // console.log(req.params.id)
        db.get_skillstack([req.params.id]).then(skillstack=> res.status(200).send(skillstack)).catch(error=>{console.error(error);res.status(500).send(err)})
    },
    getProjCons: (req, res) => {
        const db = req.app.get('db') 
        console.log(req.query.projectId)
        db.get_project_contributors([req.query.projectId]).then(projCons=> res.status(200).send(projCons)).catch(error=>{console.error(error);res.status(500).send(err)})
    },
    create: (req, res, next) => {
        const db = req.app.get('db') 
        db.create_projects([req.body.user_id,req.body.content]).then(()=> res.status(200).send()).catch(error=>{console.error(error);res.status(500).send(err)})
  
    },
}