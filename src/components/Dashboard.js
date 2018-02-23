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
import ProjectTile from './ProjectTile';

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
            showConnections: true,
            showMessage: false,
            postContent: '',
            showMine: true,
            showExplore: false,
            showCreate: false,
        };
        this.submitPost = this.submitPost.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidMount(){
        // axios.get(`/indevr/contacts?user_id=${this.props.user.id}`).then(res=>{
        axios.get(`/indevr/contacts?user_id=1`).then(res=>{
            this.setState({contacts: res.data})
            console.log('connections', this.state.contacts)
        }).catch(error=>console.log(error))
        // axios.get(`/indevr/projects?user_id=${this.props.user.id}`).then(res=>{
        axios.get(`/indevr/projects?user_id=13`).then(res=>{
            res.data[0] ? this.setState({projects: res.data}) : this.setState({projectView: 'others'})
            console.log('my projects', this.state.projects)
        }).catch(error=>console.log(error))
        // axios.get(`/indevr/public?user_id=${this.props.user.id}`).then(res=>{
        axios.get(`/indevr/public?user_id=1`).then(res=>{
            this.setState({publicProj: res.data})
            console.log('public projects', this.state.projects)
        }).catch(error=>console.log(error))
        axios.get('/indevr/posts').then(res=>{
            this.setState({posts: res.data})
        console.log('posts', this.state.posts)
        }).catch(error=>console.log(error))
        axios.get(`/indevr/messages?user_id=${this.props.user.id}`).then(resp=> {
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

    switchProjectView(tab){
        document.querySelector('.active').classList.remove('active');
        document.getElementById(tab).classList.add('active');

        this.setState({
            showMine: tab === 'mine' ? true : false,
            showExplore: tab === 'explore' ? true : false,
            showCreate: tab === 'create' ? true : false,
        })
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

                <div className="container">
                    <h4  className="clickable" onClick={() => this.setState({showConnections: !this.state.showConnections})}>
                        My Network &nbsp;
                        <ToggleDisplay show={this.state.showConnections}>
                            <i className="fas fa-chevron-up"></i>
                        </ToggleDisplay>
                        <ToggleDisplay show={!this.state.showConnections}>
                            <i className="fas fa-chevron-down"></i>
                        </ToggleDisplay>
                    </h4>
                </div>
                <Network className="container">
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

                <Content className="container">

                    <Projects>
                        <Tabs>
                            <div onClick={ () => this.switchProjectView('mine')} id="mine" className="active">
                                My projects
                            </div>
                            <div onClick={ () => this.switchProjectView('explore')} id="explore">
                                Explore projects
                            </div>
                            <div onClick={ () => this.switchProjectView('create')} id="create">
                                Create New Project
                            </div>
                        </Tabs>
                        <div class="project-wrapper">
                            <ToggleDisplay show={this.state.showMine}>
                                {this.state.projects.length &&
                                    this.state.projects.map((project, i) => {
                                        return (
                                            <Link to={`project/${project.project_id}`} key={i}>
                                                <ProjectTile
                                                    title={project.project_name}
                                                    skills={project.skills}
                                                    desc={project.description} />
                                            </Link>
                                        )
                                    })}
                                {!this.state.projects[0] && <div> You have no projects. Explore other projects to contribute</div>}
                            </ToggleDisplay>

                            <ToggleDisplay show={this.state.showExplore}>
                                <Explorer />
                            </ToggleDisplay>

                            <ToggleDisplay show={this.state.showCreate}>
                                <CreateProject user_id={this.props.user.id}/>
                            </ToggleDisplay>
                        </div>
                    </Projects>
                    
                    <Feed>

                    </Feed>
                </Content>











                <Main>

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

const Content = glam.div({
    marginTop: 50,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '@media (max-width: 767px)':{
        '> div':{
            width: '100vw',
            minWidth: '100vw'
        }
    }
})

const Projects = glam.div ({
    color: '#333',
    padding: 10,
    width: '40%',
    minWidth: 400,
    minHeight: '50vh',
    '& a':{
        textDecoration: 'none',
        color: 'inherit'
    },
    '& .project-wrapper':{
        backgroundColor: 'var(--main-grey)',
        paddingTop: 20
    }
})

const Feed = glam.div({
    width: '60%',
    minWidth: 400
})

const Tabs = glam.div({
    color: '#fff',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    '> div':{
        backgroundColor: 'var(--main-black)',
        padding: 10,
        borderRadius: '10px 10px 0 0',
        marginRight: 5,
        cursor: 'pointer',
    },
    '& .active':{
        backgroundColor: 'var(--main-grey)'
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
