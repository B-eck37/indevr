import React, { Component } from 'react';
import {Link} from 'react-router-dom';
// import {login} from '../ducks/reducer';
import {connect} from 'react-redux';
import axios from 'axios';
import glam from 'glamorous';
import profpic from '../assets/prof-pic.png';
import showtrue from '../assets/collapse.png';
import showfalse from '../assets/show.png';
import CreateProject from './CreateProject'
import Explorer from './Explorer';
import UserTile from './UserTile';
import ToggleDisplay from 'react-toggle-display';


class Dashboard extends Component {
    constructor(){
        super();
        this.state={
            projects: [],
            publicProj: [],
            posts: [],
            contacts: [],
            messages: [],
            messageCount: 0,
            showConnections: false,
            showMessage: false,
            projectView: 'mine',
            postContent: ''
        };
        this.submitPost = this.submitPost.bind(this)
        this.deletePost = this.deletePost.bind(this)
        this.switchProjectView = this.switchProjectView.bind(this)
    }

    componentDidMount(){
        axios.get(`/indevr/contacts?user_id=${this.props.user.id}`).then(res=>{
            this.setState({contacts: res.data})
            console.log('connections', this.state.contacts)
        }).catch(error=>console.log(error))
        axios.get(`/indevr/projects?user_id=${this.props.user.id}`).then(res=>{
            res.data[0] ? this.setState({projects: res.data}) : this.setState({projectView: 'others'})
            console.log('my projects', this.state.projects)
        }).catch(error=>console.log(error))
        axios.get(`/indevr/public?user_id=${this.props.user.id}`).then(res=>{
            this.setState({publicProj: res.data})
            console.log('public projects', this.state.projects)
        }).catch(error=>console.log(error))
        axios.get('/indevr/posts').then(res=>{
            this.setState({posts: res.data})
        console.log('posts', this.state.posts)
        }).catch(error=>console.log(error))
        // axios.get(`/indevr/messages?user_id=${this.props.user.id}`).then(resp=> {
        axios.get(`/indevr/messages?user_id=13`).then(resp=> {
            this.setState({messages: resp.data, messageCount: resp.data.length})
            console.log('messages', resp.data)
        }).catch(error=>console.log(error))
    }


    acceptContributor(messageId, project_id, contributor_id){
        console.log('input', messageId, project_id, contributor_id)
        axios.post('/indevr/contributors', {project_id: project_id, user_id: contributor_id, owner: false}).then(resp=>{
            axios.delete(`/indevr/messages/${messageId}`).then(resp=>{
                axios.get(`/indevr/messages?user_id=${this.props.user.id}`).then(resp=> {
                    this.setState({messages: resp.data})
                    console.log('messages', resp.data)
                }).catch(error=>console.log(error))
            }).catch(error=>console.log(error))
        }).catch(error=>console.log(error))
    }

    declineContributor = (messageId) => {
        axios.delete(`/indevr/messages/${messageId}`).then(resp=>{
            axios.get(`/indevr/messages?user_id=${this.props.user.id}`).then(resp=> {
                this.setState({messages: resp.data})
                console.log('messages', resp.data)
            }).catch(error=>console.log(error))
        }).catch(error=>console.log(error))
    }

    switchProjectView (view) {
        // console.log(view)
        this.setState({projectView: view})
    }

    submitPost(content) {
        console.log('post content', content)
        axios.post('/indevr/posts', {user_Id: this.props.user.id, content:content}).then(resp=>{
            console.log('this is the response', resp.data)
            axios.get('/indevr/posts').then(res=>{
                this.setState({posts: res.data, postContent: ''})
            console.log('posts', this.state.posts)
            }).catch(error=>console.log(error))
            console.log('this is the state after setting response to it', this.state.posts)
        }).catch(error=>console.log(error))
    }

    deletePost(postId){
        console.log(postId)
        axios.delete(`/indevr/posts/${postId}`).then(resp=>{
            axios.get('/indevr/posts').then(res=>{
                this.setState({posts: res.data})
            console.log('posts', this.state.posts)
            }).catch(error=>console.log(error))
        }).catch(error=>console.log(error))
    }

    render() {
        console.log(this.props.user.id)
        return (
            <Dashboard1>
                <Heading>Hello, Friendly Developer!</Heading>

                <Messages>
                    <div className="clickable" onClick={ () => this.setState({ showMessage: !this.state.showMessage})}>
                        {this.state.messageCount > 0 && `You have ${this.state.messageCount} ${this.state.messageCount > 1 ? ' messages ' : ' message '}`} {this.state.messageCount > 0 && <i class="far fa-envelope"></i>}
                    </div>

                    <ToggleDisplay show={this.state.showMessage}>
                        {this.state.messages.map(message => {
                            return (
                                <MessageItem key={message.id}>
                                    <div>
                                        <Link to={`/dev/${message.contributor_id}`}>
                                            <img src={message.picture||profpic} alt="message"/>
                                        </Link>
                                    </div>
                                    <div>
                                        <h3>{message.first_name} {message.last_name}</h3>
                                        <div>wants to work on</div>
                                        <Link to={`/project/${message.project_id}`}>
                                            <h3>{message.project_name}</h3>
                                        </Link>
                                    </div>
                                    <div>
                                        <button className="btn btn-success" onClick={e=>{this.acceptContributor(message.id, message.project_id, message.contributor_id)}}>Accept</button>
                                        <button className="btn btn-danger" onClick={e=>{this.declineContributor(message.id)}}>Decline</button>
                                    </div>
                                </MessageItem>
                            )
                        })}
                    </ToggleDisplay>

                </Messages>

                <Network className="container">
                    <h4  className="clickable" onClick={() => this.setState({showConnections: !this.state.showConnections})}>
                        My Network &nbsp;
                        <ToggleDisplay show={this.state.showConnections}>
                            <i className="fas fa-chevron-up"></i>
                        </ToggleDisplay>
                        <ToggleDisplay show={!this.state.showConnections}>
                            <i className="fas fa-chevron-down"></i>
                        </ToggleDisplay>
                    </h4>
                    <ToggleDisplay show={this.state.showConnections} className="contacts">
                        {this.state.contacts.map((contact,i) => {
                            return (
                                <Link to={`/dev/${contact.id}`} key={i}>
                                    <UserTile
                                        name={contact.first_name + ' ' + contact.last_name}
                                        img={contact.picture}/>
                                </Link>
                            );
                        })}
                        {!this.state.contacts.length && 'You haven\'t made any connections yet :('}
                    </ToggleDisplay>
                </Network>











                <Main>
                    <Projects>
                        <Nav>
                            <div onClick={e=>this.switchProjectView('mine')}>My projects</div>
                            <div onClick={e=>this.switchProjectView('others')}>Explore projects</div>
                            <div onClick={e=>this.switchProjectView('create')}>Create New Project</div>
                        </Nav>
                        {/* {this.state.projects[0] && */}
                        <ProjectList>
                            {this.state.projectView==='mine' && this.state.projects[0] &&
                                this.state.projects.map(proj =>
                                    <ProjectItem key={`mine${proj.id}`}>
                                        <Link to={`/project/${proj.project_id}`}>
                                            <h2>{proj.project_name}</h2>
                                        </Link>
                                        <div>{proj.description}</div>
                                    </ProjectItem>)}
                            {this.state.projectView==='mine' && !this.state.projects[0] && <div> You have no projects. Explore other projects to contribute</div>}
                            {this.state.projectView==='create' && <CreateProject user_id={this.props.user.id}/>}
                            {this.state.projectView==='others' && <Explorer/>}
                        </ProjectList>
                    </Projects>
                    <Side>
                        <Newpost>
                            <textarea placeholder="what gem did you find?" value={this.state.postContent} cols="25" onChange={e=>{this.setState({postContent:e.target.value})}}></textarea><br/>
                            <button onClick={e=>{this.submitPost(this.state.postContent)}}>Post</button>
                        </Newpost>
                        <PostFeed>
                            THE LATEST NEWS
                            {this.state.posts.map(item =>
                                <PostItem key={item.post_id}>
                                    <PostTitle>
                                        {item.content}
                                        <Xxx onClick={e=>{this.deletePost(item.post_id)}}>x</Xxx>
                                    </PostTitle>
                                    <div>
                                    <small><small>{item.created_at}</small></small>

                                    <div><img src={item.picture} alt="profile"/> {item.first_name} {item.last_name}</div>
                                    </div>
                                </PostItem>)}
                        </PostFeed>
                    </Side>
                </Main>
            </Dashboard1>
        );
    }
}




const Dashboard1 = glam.div ({
    // padding: 50
    backgroundColor: 'var(--main-purple)',
    color: '#fff',
    paddingTop: 20,
    '& .clickable':{
        cursor: 'pointer'
    }
})

const Heading= glam.h1 ({
    padding: 20,
    color: 'white',
    background: 'var(--main-purple)',
    fontSize: 24,
    textAlign: 'center',
})

const Network = glam.div({
    maxWidth: '90vw',
    overflowX: 'auto',
    '> .contacts':{
        display: 'flex',
        justifyContent:'flex-start',
        '> a':{
            margin: 10
        }
    },
})

const Messages = glam.div({
    textAlign: 'center',
    color: 'red'
})

const MessageItem = glam.div ({
    color: '#fff',
    margin: '20px 0',
    '& a': {
        textDecoration: 'none',
        color: 'inherit'
    },
    '& button': {
        marginLeft: 10,
    },
    '& img': {
        marginRight: 5,
        height: 100,
        width: 100,
        marginBottom: 20,
        borderRadius: '50%'
    },
    '& h3':{
        marginTop: 0
    },
    '@media (min-width: 767px)':{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        '> div':{
            margin: 20
        }
    }

})







const Greeting = glam.div ({
    // display: 'flex',
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    width: '100%'
})



const Contacts = glam.div ({
    fontSize: 14,
    padding: '5px 5px 5px 20px',
    marginBottom: 10,
    cursor: 'Pointer',
    '& img': {
        width: 40,
        height: 40,
        borderRadius: '50%'
    },
    '& div': {
        // width: 500,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    '@media (max-width: 500px)': {
        marginBottom: 0,
        padding: 10,
        '& span': {
            margin: 'auto',
        }
    },
    '& h4': {
        margin: 0,
        padding: 10
    },
    '& h6': {
        margin: 0,
        padding: 10
    }
})

const ContactItem = glam.div ({
    cursor: 'pointer',
    display: 'flex',
    background: '#eeeeee',
    borderRadius: 2,
    padding: 2,
    margin: '2px 10px 2px 2px',
    '& a': {
        textDecoration: 'none'
    },
    '& img': {
        marginRight: 5
    }
})

const Messagesss = glam.div ({
    fontSize: 14,
    padding: '5px 5px 5px 20px',
    marginBottom: 10,
    cursor: 'Pointer',
    '& img': {
        width: 40,
        height: 40,
        borderRadius: '50%'
    },
    '& span': {

    },
    '@media (max-width: 500px)': {
        marginBottom: 0,
        padding: 10,
        '& span': {
            margin: 'auto',
        }
    },
    '& h4': {
        margin: 0,
        padding: 10
    },
})


// const MessageItem = glam.div ({
//     cursor: 'pointer',
//     // padding:10,
//     background: '#eeeeee',
//     borderRadius: 2,
//     padding: 2,
//     // width:200,
//     margin: 2,
//     '& a': {
//         textDecoration: 'none'
//     },
//     '& button': {
//         marginLeft: 10,
//         padding: 3,
//         borderRadius: 3,
//         background: 'var(--main-grey)'
//     },
//     '@media (max-width: 500px)': {
//         maxWidth: 350
//     },
//     '& img': {
//         marginRight: 5
//     }
// })

const Count = glam.span({
    margin: '0 0 0 5px',
    background: 'red',
    color: 'white'
})

const Collapse = glam.span({
    padding: 0,
    margin: '0 0 0 5px',
    '& img': {
        width: 15,
        height:15
    }
})

const Main = glam.div ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    '@media (max-width: 500px)':{
        flexDirection: 'column',
        padding: 10
    }
})

const Projects = glam.div ({
    padding: 10
})

const Nav = glam.div ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    // padding: 20,
    '& div': {
        padding: '8px 15px 8px 15px',
        marginRight: 10,
        color: 'black',
        background: 'var(--main-grey)',
        borderBottom: '3px solid #593c8f',
        borderRadius: '8px 8px 0 0',
        cursor: 'pointer'
    }
})

const ProjectItem = glam.div ({
    cursor: 'pointer',
    background: '#eeeeee',
    margin: 2,
    '& a': {
        textDecoration: 'none'
    }
})

const ProjectList = glam.div ({
    '& div': {
        padding: 10,
        textAlign: 'left',
    }
})


const Side = glam.div ({
    maxWidth: 300,
    background: '#eeeeee',
    padding: 20,
    '@media (max-width: 500px)': {
        display: 'none'
    }
})

const Newpost = glam.div ({
    '& textarea': {
        borderRadius: 3,
        padding: 3
    },
    marginBottom: 10,
})

const PostFeed = glam.div ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    '& img': {
        height: 25,
        width: 25,
        borderRadius: '50%',
        marginRight: 10
    },

})

const PostItem = glam.div({
    marginBottom: 5,
    padding: 5,
})

const PostTitle = glam.div ({
    display: 'flex',
    background: 'white',
    borderRadius: 10,
    padding:5,
    justifyContent: 'space-between',
    minWidth: 200

})

const Xxx = glam.div({
    cursor: 'pointer',
    '&:hover': {
        opacity: '1',
        transform: 'scale(1.2)'
    },
    '&:not(:hover)': {
        opacity: '0.4'
    }
})

const mapStateToProps = state => {
    return {
      user: state.user
    }
  }


export default connect(mapStateToProps)(Dashboard);
