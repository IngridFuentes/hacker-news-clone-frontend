import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import firebase from 'firebase'

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const auth = firebase.auth();
const db = firebase.firestore();

//signup
//here is an example of how to use the signup function
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info from signup form
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const username = signupForm['signup-username'].value;
    const data = {
        email: email,
        password: password,
        username: username,
    };

    //calls cloud function here
    var register = firebase.functions().httpsCallable('register');
    register(data).then(status => {
        console.log(status);
        return status;
    })
})

//logout
//an example of how to use the logout function
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})


// login
//an example of how to use the login function
// IMPORTANT: input takes email and password (not username)
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log("Login completed");
    })
})


//takes text post and username
//An example of how to use add comment function
const addComment = document.querySelector('#comment-form');
addComment.addEventListener('submit', (e) => {
    //gets current user
    var user = firebase.auth().currentUser;
    if(user){
        const text = addComment['comment-text'].value;
        //IMPORTANT: post must be changed to the actual title of the posts
        const post = "Title of Post";
        data={
            text: text,
            post: post,
            username: user.displayName
        };
        //calls cloud function for adding comment
        var addComment = firebase.functions().httpsCallable('addComment');
        addComment(data)
        .then(status => {
            if(status.data == true){
                console.log("Comment added successfully");
            } else{
                console.log("Comment was not added");
            }
        })
        .catch(error=>{
            console.log("Error when adding comment ", error);
        })
    }
    else{
        // user does not exist so they are not signed in
        console.log("Not signed in");
        return {status: "Must be signed in to add comment"};
    }
})