import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import firebase from 'firebase';
//import auth from 'firebase';
import { render } from '@testing-library/react';

class Submit extends Component { 
    
    constructor() {
        super();
        this.state = {
          title: '',
          url: '',
          redirect: false
        };
      }
    
      handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name] : value})
    }


    onSubmit = (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        console.log(user);
        if (user){
            const username = user.displayName;
            const data = {
                postTitle: this.state.title,
                url: this.state.url,
                userID: username 
            };
            console.log(data);
    
            var verifyPost = firebase.functions().httpsCallable('verifyPost');
            verifyPost(data)
            .then(status => {
                console.log(status);

                if(status.data === "true"){
                    this.setState({redirect: true});
                }
                else{
                    console.log("Error while submitting a post");
                    var x = document.getElementById('Submit-Error');
                    x.innerHTML = '<p style="color:#FF0000";>Post Title already Exists</p>';
                }
                
            })
            .catch(error =>{
                console.log("Error while submitting a post: ", error);
            })
        
        } else {
            alert('you must be signed in');
        }
    }
    
    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/newest' />
        }
      }

    render() {
    return(
        <div>
            <div>
                <h1 className="submit">Submit</h1>
            </div>
        <form onSubmit={this.onSubmit}>
            <div>
            <p>Title:</p>
                <input
                type="text"
                id="title"
                name="title"
                value={this.state.title}
                onChange={this.handleChange}
                />
            </div>
            <div>
                <p>URL</p>
                <input
                type="text"
                id="url"
                name="url"
                value={this.state.url}
                onChange={this.handleChange}
                />
            </div>
            <br/>
                <button>Submit</button>
                {this.renderRedirect()}
        </form>
        <div id="Submit-Error"></div>
        </div>
    )
    }
// }
}

export default Submit;