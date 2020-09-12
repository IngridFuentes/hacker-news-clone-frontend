import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import auth from 'firebase';
import { render } from '@testing-library/react';

class Submit extends Component { 
    
    constructor() {
        super();
        this.state = {
          title: '',
          url: '',
        };
      }
    
    
    // onSubmitSignUp = (e) => {
    //     e.preventDefault();
    //     const user = firebase.auth().currentUser;

    //     if (user){
    //         const username = user.displayName;
    //     } else {
    //         return "You must be logged in"
    //     }

    //     const data = {
    //         title: this.state.title,
    //         url: this.state.url,      
    //     };
    //     console.log(data);

        // var verifyPost = firebase.functions().httpsCallable('verifyPost');
        // verifyPost(data).then(status => {
        //     console.log(status);
        //     if(status.data.status === "User exists"){
        //         console.log("Username already exists");
        //         // x = document.getElementById('Signup-Error');
        //         // x.innerHTML = '<p style="color:#FF0000";>Username already exists</p>';
        //     }
        //     else{
        //         firebase.auth().signInWithEmailAndPassword(data.email, data.password)
        //         .then(cred =>{
        //             console.log(cred);
        //             this.setState({redirect: true});
        //         });
        //         console.log("Registration successful");
        //     }
        // })
    // }
    
    render() {
    return(
        <div>
            <div>
                <h1 className="submit">Submit</h1>
            </div>
        <form>
            <div>
            <p>Title:</p>
                <input
                type="text"
                id="title"
                />
            </div>
            <div>
                <p>URL</p>
                <input
                type="text"
                id="url"
                />
            </div>
            <div>
                <p>Text</p>
                <input
                type="text"
                id="txtbox"
                
                />
            </div>
            <br/>
            <Link to="/newest">
                <button>Submit</button>
            </Link>
        </form>
        </div>
    )
    }
}

export default Submit;