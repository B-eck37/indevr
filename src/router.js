import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import Chat from './components/Chat';
import TaskBoard from './components/Taskboard/Taskboard';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import SearchPage from './components/SearchPage';
import PublicExplore from './components/PublicExplore';
import EditProfile from './components/EditProfile';
import About from './components/About';
import Contact from './components/Contact';
import White from './components/White';


export default (
    <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/login' component={LandingPage} />
        <Route exact path="/dashboard" component={Dashboard}/>
        <Route path="/project/:id" component={ProjectView}/>
        <Route path="/chat" component={Chat} />
        <Route path="/tasks" component={TaskBoard} />
        <Route path="/dev/:userID" component={Profile} />
        <Route path="/edit" component={EditProfile} />
        <Route path='/search' component={SearchPage} />
        <Route path='/about/indevr' component={About} />
        <Route path="/explore" component={PublicExplore}/>
        <Route path='/contact/indevr' component={Contact} />
        <Route path = '/whiteboard' component={White} />
    </Switch>
)
