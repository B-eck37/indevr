import React, {Component} from 'react'
import glam from 'glamorous';
import DropZone from './DropZone';
import axios from 'axios';
import request  from 'superagent';
import {connect} from 'react-redux';
import AddSkills from './AddSkills/AddSkills';


class EditProfile extends Component {
    constructor(){
        super();
        this.state = {
            picture: '',
            first_name: '',
            last_name: '',
            bio: '',
            email: {value: '', public: false},
            location: {value: '', public: false},
            portfolio: {value: '', public: false},
            website: {value: '', public: false},
            github:  {value: '', public: false},
            bitbucket:  {value: '', public: false},
            gitlab: {value: '', public: false},
            codepen: {value: '', public: false},
            twitter: {value: '', public: false},
            skills: []
        }
    }

    componentDidMount(){
        const userID = this.props.user.id;
        axios.get(`/indevr/users/${userID}`).then(res => {
            let {first_name, last_name, picture, bio, location, email, github,bitbucket,gitlab,portfolio,website,codepen,twitter, location_public, email_public,github_public,gitlab_public,bitbucket_public, portfolio_public, website_public,codepen_public,twitter_public, skills} = res.data;

            this.setState({
                first_name: first_name ? first_name : '',
                last_name: last_name ? last_name : '',
                picture: picture ? picture : '',
                bio: bio ? bio : '',
                location: {
                    value: location ? location : '',
                    public: location_public ? true : false
                },
                email: {
                    value: email ? email : '',
                    public: email_public ? true : false
                },
                github: {
                    value: github ? github : '',
                    public: github_public ? true : false
                },
                bitbucket: {
                    value: bitbucket ? bitbucket : '',
                    public: bitbucket_public ? true : false
                },
                gitlab: {
                    value: gitlab ? gitlab : '',
                    public: gitlab_public ? true : false
                },
                portfolio: {
                    value: portfolio ? portfolio : '',
                    public: portfolio_public ? true : false
                },
                website: {
                    value: website ? website : '',
                    public: website_public ? true : false
                },
                codepen: {
                    value: codepen ? codepen : '',
                    public: codepen_public ? true : false
                },
                twitter:  {
                    value: twitter ? twitter : '',
                    public: twitter_public ? true : false

                },
                skills: skills
            })
        }).catch( err => console.log(err))
    }

    onDrop = (files) => {
        request.post('/api/upload')
        .attach('image', files[0])
        .end((error, response) => {
            if(error) console.log(error);
            console.log('File Uploaded Succesfully');
            this.setState({picture: response.text})
        })
    }

    saveChanges(e){
        e.preventDefault()
        const userID = this.props.user.id;
        axios.put(`/indevr/users/${userID}`, this.state).then(res => {
            console.log(res.data);
        }).catch(err => console.log(err))
        this.props.history.push(`/dev/${this.props.user.id}`)
    }

    render(){
        return (
            <div>
                <Main>
                    <div className="container">
                        <Left>
                            <label>Profile Picture</label>
                            <div className="profile-pic">
                                <img src={this.state.picture} alt="" />
                                <DropZone className="dropzone" onDrop={this.onDrop}/>
                            </div>
                            {/* <div>
                                <p>
                                    The contact information you provide here will help others find and connect with you.  You can choose what is displayed publically using the switches next to each field.
                                </p>
                            </div> */}

                            <Form>
                                <div className="row">
                                    <div className="form-group col-sm-6" id='div1'>
                                        <label>First Name</label>
                                        <input className="form-control"
                                            value={this.state.first_name}
                                            onChange={ e => this.setState({ first_name: e.target.value || ''} )} />
                                    </div>
                                    <div className="form-group col-sm-6" id='div2'>
                                        <label>Last Name</label>
                                        <input className="form-control"
                                            value={this.state.last_name}
                                            onChange={ e => this.setState({ last_name: e.target.value || ''} )} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group col-xs-12">
                                        <label>Bio</label>
                                        <textarea className="form-control"
                                            value={this.state.bio}
                                            onChange={ e => this.setState({ bio: e.target.value || ''} )}
                                        ></textarea>
                                    </div>
                                </div>
                            </Form>
                            <AddSkills skills={this.state.skills} user={this.props.user.id}/>
                        </Left>
                        <div>
                            <Form>


                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.email.public || false}
                                                onChange={e => this.setState({
                                                    email: {value: this.state.email.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Email</label>
                                        <input className="form-control"
                                            type="email"
                                            value={this.state.email.value || ''}
                                            onChange={ e => this.setState({ email: {value: e.target.value, public: this.state.email.public} })} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.location.public || false}
                                                onChange={e => this.setState({
                                                    location: {value: this.state.location.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Location</label>
                                        <input className="form-control"
                                            value={this.state.location.value || ''}
                                            onChange={ e => this.setState({ location: {value: e.target.value, public: this.state.location.public} })} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.portfolio.public || false}
                                                onChange={e => this.setState({
                                                    portfolio: {value: this.state.portfolio.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Portfolio</label>
                                        <input className="form-control"
                                            value={this.state.portfolio.value || ''}
                                            onChange={ e => this.setState({ portfolio: {value: e.target.value, public: this.state.portfolio.public} })} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.website.public || false}
                                                onChange={e => this.setState({
                                                    website: {value: this.state.website.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Website</label>
                                        <input className="form-control"
                                            value={this.state.website.value  || ''}
                                            onChange={ e => this.setState({ website: {value: e.target.value, public: this.state.website.public} })} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.github.public || false}
                                                onChange={e => this.setState({
                                                    github: {value: this.state.github.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Github</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">https://github.com/</span>
                                            <input className="form-control"
                                                value={this.state.github.value || ''}
                                                onChange={ e => this.setState({ github: {value: e.target.value, public: this.state.github.public} })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.bitbucket.public || false}
                                                onChange={e => this.setState({
                                                    bitbucket: {value: this.state.bitbucket.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Bitbucket</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">https://bitbucket.org/</span>
                                            <input className="form-control"
                                                value={this.state.bitbucket.value || ''}
                                                onChange={ e => this.setState({ bitbucket: {value: e.target.value, public: this.state.bitbucket.public} })} />
                                        </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.gitlab.public || false}
                                                onChange={e => this.setState({
                                                    gitlab: {value: this.state.gitlab.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>GitLab</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">https://gitlab.com/</span>
                                            <input className="form-control"
                                                value={this.state.gitlab.value || ''}
                                                onChange={ e => this.setState({ gitlab: {value: e.target.value, public: this.state.gitlab.public} })} />
                                        </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.codepen.public || false}
                                                onChange={e => this.setState({
                                                    codepen: {value: this.state.codepen.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Codepen</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">https://codepen.io/</span>
                                            <input className="form-control"
                                                value={this.state.codepen.value || ''}
                                                onChange={ e => this.setState({ codepen: {value: e.target.value, public: this.state.codepen.public} })} />
                                        </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-3 text-center">
                                        <label className="switch">
                                            <input type="checkbox"
                                                checked={this.state.twitter.public || false}
                                                onChange={e => this.setState({
                                                    twitter: {value: this.state.twitter.value || '', public: e.target.checked}
                                                })}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group col-xs-9">
                                        <label>Twitter</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">https://twitter.com/</span>
                                            <input className="form-control"
                                                value={this.state.twitter.value || ''}
                                                onChange={ e => this.setState({ twitter: {value: e.target.value, public: this.state.twitter.public} })} />
                                        </div>

                                    </div>
                                </div>

                                <button className="btn btn-success pull-right"
                                    onClick={ e => this.saveChanges(e)}>Save Changes</button>

                            </Form>
                        </div>


                    </div>
                </Main>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
};

export default connect(mapStateToProps)(EditProfile);

const Main = glam.div({
    backgroundColor: 'var(--main-purple)',
    minHeight: 'calc(100vh - 100px)',
    color: '#fff',
    padding: 20,
    '> .container':{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        '> div':{
            width: '50%',
            minWidth: 300,
        },
        '& p':{
            fontSize: 24,
            textAlign: 'center',
            padding: 20
        },

    },

})


const Left = glam.div({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& .profile-pic':{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        '& img':{
            height: 200,
            width: 200,
            margin: 20,
        },
    }

})

const Form = glam.form({
    width: '100%',
    maxWidth: 500,
    '& .switch':{
        marginTop: 25
    },
    '& button':{
        marginTop: 20,
        width: 200,
        height: 60,
        fontSize: 20,
        fontWeight: 'bold'
    }
})
