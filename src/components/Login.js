import React, { Component, useDebugValue } from 'react'; 
// import Submit from './Submit';
import { Link, Redirect } from 'react-router-dom';
import firebase from 'firebase'
import db from 'firebase'



class Login extends Component { 

    componentDidMount(){
        document.getElementById('nav').style.display = "none";
     };
     componentWillUnmount(){
        document.getElementById('nav').style.display = "flex";
     };

     constructor() {
        super();
        this.state = {
          email: '',
          password: '',
          username: '',
          signupEmail: '',
          signupPassword: '',
          signupUsername: '',
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
        
        //Resets error message if there was one
        var x = document.getElementById('Signup-Error');
        x.innerHTML = '<p></p>';

        // get our form data out of state
        const email = this.state.email;
        const password = this.state.password;
        console.log("Logging in!");

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(cred =>{
            console.log(cred);
            this.setState({redirect: true});
        })
        .catch(error=>{
            console.log("Error while logging in: ",error );
            var x = document.getElementById('Login-Error');
            x.innerHTML = '<p style="color:#FF0000";>Invalid Email or Password</p>';
            
            
        })
      }
      

      onSubmitSignup = (e) => {
        e.preventDefault();
        
        // Resets error message if there was one
        var x = document.getElementById('Login-Error');
        x.innerHTML = '<p></p>';

        // get our form data out of state
        // get user info from signup form
        const data = {
            email: this.state.signupEmail,
            password: this.state.signupPassword,
            username: this.state.signupUsername,
        };
        console.log(data);

        //calls cloud function here
        var register = firebase.functions().httpsCallable('register');
        register(data).then(status => {
            console.log(status);
            if(status.data.status === "User exists"){
                console.log("Username already exists");
                x = document.getElementById('Signup-Error');
                x.innerHTML = '<p style="color:#FF0000";>Username already exists</p>';
            }
            else{
                firebase.auth().signInWithEmailAndPassword(data.email, data.password)
                .then(cred =>{
                    console.log(cred);
                    this.setState({redirect: true});
                });
                console.log("Registration successful");
            }
        })
        .catch(error =>{
            console.error("Error while registering user: ", error);
            var x = document.getElementById('Signup-Error');
            x.innerHTML = '<p style="color:#FF0000";>Email already exists</p>';
        })
      }

      //redirects to home page if successful login
      renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/' />
        }
      }

    render() { 
        const {email, password} = this.state;
        return(
            <div>
                <form onSubmit={this.onSubmit}>
                    <p>Login</p>
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/>
                    <br/>
                    <br/>
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/> <br/>
                    <br/>
                        <button type="submit">Login</button>
                        <div id="Login-Error"></div>
                        {this.renderRedirect()}
                </form>
                <br/>
                <div> Or Create an account
                    <form onSubmit={this.onSubmitSignup}>
                    <p>Sign up</p>
                    <input type="text" name="signupUsername" value={this.state.signupUsername} onChange={this.handleChange} placeholder="Username"/>
                    <br/>
                    <br/>
                    <input type="email" name="signupEmail" value={this.state.signupEmail} onChange={this.handleChange} placeholder="Email"/> <br/>
                    <br/>
                    <input type="password" name="signupPassword" value={this.state.signupPassword} onChange={this.handleChange} placeholder="Create Password"/> <br/>
                    <br/>
                        <button type="submit">Sign up</button>
                    <div id="Signup-Error"></div>
                     </form>
                </div>
            </div>
        ); 
    } 
} 
        
export default Login;