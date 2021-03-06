//Search Bar Component used to search users and projects

import React, { Component } from 'react'
import glam from 'glamorous'
import { Redirect } from 'react-router-dom'

class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchTerm: '',
            redirect: false,
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.search = this.search.bind(this);
    }

    onInputChange(value){
            this.setState({
                searchTerm: value
            });
    };

    search(){
        if(this.state.searchTerm.length <= 1){
            this.setState({
                searchTerm: ''
            })
            return <Redirect to='/search' />
        } else if (this.state.searchTerm.length > 1){
        this.setState({
            redirect: true,
        })
        }
    }

    render() {
        if(this.state.redirect){
            this.setState({redirect: false})
            return <Redirect to={`/search/${this.state.searchTerm}`} />
        }
        return (
            <Main>
                <div className="input-group">
                    <div className="form-group">
                        <input type="text"
                            className="form-control"
                            placeholder="Search inDevr"
                            onChange={e => this.onInputChange(e.target.value)}/>
                            <button type="submit" disabled={this.state.searchTerm.length <= 1} className="btn btn-default" onClick={this.search}><i className="fas fa-search"></i></button>
                    </div>
                </div>
            </Main>
        )
    }
}

const Main = glam.form({
    '& .form-group':{
        display: 'flex',
    },
    '& button':{
        marginLeft: 3
    },
    '@media (max-width: 860px)':{
        maxWidth: '100%',
        '& input':{
            width: '130px !important',
        }
    },
    '@media (max-width: 767px)':{
        '& input':{
            width: '100% !important',
        }
    },


})

export default SearchBar;
