import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import glam from 'glamorous';
import profpic from '../assets/prof-pic.png';
import CreateProject from './CreateProject'
import Explorer from './Explorer';
import UserTile from './UserTile';
import ToggleDisplay from 'react-toggle-display';
import ProjectTile from './ProjectTile';
import PostTile from './PostTile';

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
            showProjects: false
        };
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidMount(){
        if(this.props.user){
            this.getInfo(this.props.user.id)
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user && !this.props.user){
            this.getInfo(nextProps.user.id);
        }
    }

    getInfo(userId){
        axios.get(`/indevr/contacts?user_id=${userId}`).then(res=>{
            this.setState({contacts: res.data})
        }).catch(error=>console.log(error))
        axios.get(`/indevr/projects?user_id=${userId}`).then(res=>{
            res.data[0] ? this.setState({projects: res.data}) : this.setState({projectView: 'others'})
        }).catch(error=>console.log(error))
        axios.get(`/indevr/public?user_id=${userId}`).then(res=>{
            this.setState({publicProj: res.data})
        }).catch(error=>console.log(error))
        axios.get('/indevr/posts').then(res=>{
            this.setState({posts: res.data})
        }).catch(error=>console.log(error))
        axios.get(`/indevr/messages?user_id=${userId}`).then(resp=> {
            this.setState({messages: resp.data, messageCount: resp.data.length})
        }).catch(error=>console.log(error))
    }


    acceptContributor(messageId, project_id, contributor_id){
        this.setState((prevState, props) => {
            return {messageCount: prevState.messageCount - 1}
        })
        this.setState({ messageCount: this.state.messageCount - 1 })
        axios.post('/indevr/contributors', {project_id: project_id, user_id: contributor_id, owner: false}).then(resp=>{
            axios.delete(`/indevr/messages/${messageId}`).then(resp=>{
                axios.get(`/indevr/messages?user_id=${this.props.user.id}`).then(resp=> {
                    this.setState({messages: resp.data})
                }).catch(error=>console.log(error))
            }).catch(error=>console.log(error))
        }).catch(error=>console.log(error))
    }

    declineContributor = (messageId) => {
        this.setState((prevState, props) => {
            return {messageCount: prevState.messageCount - 1}
        })
        axios.delete(`/indevr/messages/${messageId}`).then(resp=>{
            axios.get(`/indevr/messages?user_id=${this.props.user.id}`).then(resp=> {
                this.setState({messages: resp.data})
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

    submitPost(content, e) {
        e.preventDefault()
        if (content!=='') {
            // var date1 = new Date();
            axios.post('/indevr/posts', {user_Id: this.props.user.id, content:content}).then(resp=>{
                axios.get('/indevr/posts').then(res=>{
                    this.setState({posts: res.data, postContent: ''})
                }).catch(error=>console.log(error))
            }).catch(error=>console.log(error))
        }
    }

    deletePost(postId){
        axios.delete(`/indevr/posts/${postId}`).then(resp=>{
            axios.get('/indevr/posts').then(res=>{
                this.setState({posts: res.data})
            }).catch(error=>console.log(error))
        }).catch(error=>console.log(error))
    }

    toggleProjectsMobile(){
        this.setState({showProjects: !this.state.showProjects});
        const projects = document.getElementById('projects');
        projects.classList.toggle('hidden');
    }

    render() {
        if(!this.props.user){
            return <Loading><i className="fas fa-spinner fa-pulse fa-7x"></i></Loading>
        }
        return (
            <Main>
                <Heading>Hello, Friendly Developer!</Heading>

                <Messages>
                    <div className="clickable" onClick={ () => this.setState({ showMessage: !this.state.showMessage})}>

                        {this.state.messageCount > 0 && <div>New messages! <i className="far fa-envelope"></i></div>}

                        {/* {this.state.messageCount > 0 && `You have ${this.state.messageCount} ${this.state.messageCount > 1 ? ' messages ' : ' message '}`} {this.state.messageCount > 0 && <i className="far fa-envelope"></i>} */}
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
                        <ToggleDisplay show={!this.state.showConnections}>
                            <i className="fas fa-chevron-up"></i>
                        </ToggleDisplay>
                        <ToggleDisplay show={this.state.showConnections}>
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

                <div className="container">
                    <h4  className="clickable mobile-show" onClick={() => this.toggleProjectsMobile()}>
                        Projects &nbsp;
                        <ToggleDisplay show={this.state.showProjects}>
                            <i className="fas fa-chevron-up"></i>
                        </ToggleDisplay>
                        <ToggleDisplay show={!this.state.showProjects}>
                            <i className="fas fa-chevron-down"></i>
                        </ToggleDisplay>
                    </h4>
                </div>
                <Content className="container">
                    <Projects id="projects">

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
                        <div className="project-wrapper">
                            <ToggleDisplay show={this.state.showMine}>
                                {this.state.projects.length > 0 &&
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
                                {!this.state.projects.length && <div className="padding"> You have no projects. Explore other projects to contribute</div>}
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
                        <Form>
                            <textarea
                                className="form-control"
                                placeholder="What gem did you find?"
                                value={this.state.postContent}  onChange={e=>{this.setState({postContent:e.target.value})}}
                                ></textarea>
                            <button
                                className="btn btn-default pull-right"
                                onClick={e=> this.submitPost(this.state.postContent, e)}
                                >Post</button>
                        </Form>

                        THE LATEST NEWS
                        {this.state.posts.map((item,i) => {
                            let deletePost = this.deletePost.bind(this, item.post_id)
                            return (
                                <PostTile
                                    key={i}
                                    id={item.post_id}
                                    name={item.first_name + ' ' + item.last_name}
                                    timestamp={item.created_at.slice(0,10)}
                                    content={item.content}
                                    user_id={item.user_id}
                                    picture={item.picture}
                                    deletePost={deletePost}
                                />
                            );
                        })}
                    </Feed>
                </Content>
            </Main>
        );
    }
}




const Main = glam.div ({
    // padding: 50
    backgroundColor: 'var(--main-purple)',
    color: '#fff',
    paddingTop: 20,
    '& .clickable':{
        cursor: 'pointer'
    },

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
    },
    '@media (min-width: 1081)':{
        '& .mobile-show':{
            display: 'none'
        }
    }
})

const Projects = glam.div ({
    color: '#333',
    padding: 10,
    width: 400,
    maxWidth: '100%',
    minHeight: '50vh',
    '& a':{
        textDecoration: 'none',
        color: 'inherit'
    },
    '& .project-wrapper':{
        backgroundColor: 'var(--main-grey)',
        minHeight: 400,
        paddingTop: 20,
        paddingBottom: 20,
        '& .padding':{
            padding: 20
        }
    },
    '@media (max-width: 1080)':{
        marginTop: -50
    }
})

const Feed = glam.div({
    color: '#fff',
    width: '50%',
    minWidth: 400,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    '> div':{
        margin: 10,
        color: '#333',
    }
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

const Form = glam.form({
    marginBottom: 20,
    width: 400,
    maxWidth: 'calc(100vw - 20px)',
    '> textarea':{
        height: 100,
    },
    '> button':{
        marginTop: 10,
        height: 50,
        width: 100,
        fontSize: 18,
        alignItems: 'flex-end'
    }
})

const Loading = glam.div({
    minHeight: 'calc(100vh - 230px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})





const mapStateToProps = state => {
    return {
      user: state.user
    }
  }


export default connect(mapStateToProps)(Dashboard);
