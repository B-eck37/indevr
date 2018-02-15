//Imports
require('dotenv').config();
const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    massive = require('massive'),
    multer =  require('multer'),
    AWS = require('aws-sdk'),
    socket = require('socket.io');
    user = require('./controller/user_controller');
    posts = require('./controller/post_controller');
    contact = require('./controller/contact_controller');
    proj = require('./controller/project_controller');
    auth_ctrl = require('./controller/auth0_controller');
    taskboard_ctrl = require('./controller/taskboard_controller');
    news_feed_ctrl = require('./controller/news_feed_controller');


//App Setup
const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } //24 hours
}));
app.use(express.static(`${__dirname}/../build`));


// AWS declare
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION
});
const s3 = new AWS.S3();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 52428800
  }
})

// AWS Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
    var uniqueIdentifier = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++){
        uniqueIdentifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    s3.putObject({
        Bucket: process.env.BUCKET,
        Key: uniqueIdentifier + req.file.originalname,
        Body: req.file.buffer,
        ContentType: "image/png",
        ACL: 'public-read'
    }, (err) => {
      console.log(err);
        if (err) return res.status(400).send(err);
        res.send(`https://s3-${process.env.REGION}.amazonaws.com/${process.env.BUCKET}/${uniqueIdentifier}${req.file.originalname}`);
    })
})


//Massive
massive(process.env.CONNECTION_STRING)
.then(db => app.set('db', db))
.catch(err => console.error(err));

// SOCKETS FOR WHITEBOARD
// var io = socketIo.listen(server);
// var line_history = [];

// event-handler for new incoming connections
// io.on('connection', function (socket) {

// for (var i in line_history) {
//       socket.emit('draw_line', { line: line_history[i] } );
//    }

//    socket.on('draw_line', function (data) {
//       line_history.push(data.line);
//       io.emit('draw_line', { line: data.line });
//    });
// });



//API Endpoints

// ---------------USER-------------------
const userAPIurl = '/indevr/users'

// app.put(`${userAPIurl}/:id`, user.update);
// app.delete(`${userAPIurl}/:id`, user.delete);

// ---------------CONTACTS-------------------
const contactAPIurl = '/indevr/contacts'

// app.post(`${contactAPIurl}/create`, contact.add);
// app.put(`${contactAPIurl}/:id`, contact.update);
// app.delete(`${contactAPIurl}/logout`, contact.unfriend);
app.get(`${contactAPIurl}/connect`, contact.get);
app.get(`${contactAPIurl}`, contact.get);
//
//

//-------------PUBLIC POST FEED--------------
const postAPIurl = '/indevr/posts'
app.get(postAPIurl, posts.get)
app.get(`${postAPIurl}/:userID`, news_feed_ctrl.getProfileFeed)
// app.post(newsAPIurl, posts.create)
// app.put(newsAPIurl, posts.update)
// app.delete(newsAPIurl, posts.delete)

//-----------PROJECTS----------------
const projAPIurl = '/indevr/projects';

app.get(projAPIurl, proj.getUserProj); //uses query
app.get(`${projAPIurl}/:id`, proj.getSingle); //uses params
app.get(`${projAPIurl}/skills/:id`, proj.getSkillStack); //uses params
app.get(`/indevr/contributors`, proj.getProjCons); //uses query?
// app.post(projAPIurl, proj.create);
// app.put(projAPIurl, proj.update);
// app.delete(projAPIurl, proj.delete);

//----------PROJECT DERIVATIVES--------
const goalsAPIurl = '/indevr/goals'

// app.get(goalsAPIurl, goals.get);
// app.post(goalsAPIurl, goals.post);
// app.put(goalsAPIurl, goals.put);
// app.delete(goalsAPIurl, goals.delete);


// const userUrl = '/'
// //Auth0
// app.post(`${userUrl}/login`, (req, res) => {
//     const {userId} = req.body;
//     const auth0Url = `https://${process.env.REACT_APP_AUTH0_domain}/api/v2/users/${userId}`;
//     axios.get(auth0Url)
// })

// app.get("/checkSession", auth_ctrl.sessionCheck);




const userUrl = '/'
//Auth0
app.post(`${userUrl}/login`, (req, res) => {
    const {userId} = req.body;
    const auth0Url = `https://${process.env.REACT_APP_AUTH0_domain}/api/v2/users/${userId}`;
    axios.get(auth0Url)
})

app.get("/checkSession", auth_ctrl.sessionCheck);
app.get(userAPIurl, auth_ctrl.sessionCheck);
app.post(`/login`, auth_ctrl.user);
// app.post(`${userAPIurl}/create`, auth_ctrl.create);
// app.put(`${userAPIurl}/:id`, user.update);
app.post(`${userAPIurl}/logout`, auth_ctrl.logout);
// app.get(`${userAPIurl}/connect`, user.connect);

app.get(`${userAPIurl}/search/:term`, auth_ctrl.search);



//Shhh Listen...
const port = process.env.SERVER_PORT;
const server = app.listen(port, () => console.log(`Up and running on port ${port}`));

//Socket.io chat Setup
const io = socket(server);
io.on('connection', (socket) => {
    console.log(socket.id);
});
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })
});
