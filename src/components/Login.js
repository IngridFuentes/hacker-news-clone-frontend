import React, { Component, useDebugValue } from 'react'; 
// import Submit from './Submit';
import { Link } from 'react-router-dom';
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
        // get our form data out of state
        const email = this.state.email;
        const password = this.state.password;
        console.log("Logging in!");

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(cred =>{
            console.log(cred);
            return {status: "login successful"};
        })
        .catch(error=>{
            console.log("Error while logging in: ",error );
        })
      }
      

      onSubmitSignup = (e) => {
        e.preventDefault();
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
            return status;
        })
        
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
                    {/*<Link to="/news">*/}
                        <button type="submit">Login</button>
                    {/*</Link>*/}
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
                    {/*<Link to="/news">*/}
                        <button type="submit">Sign up</button>
                    {/*</Link>*/}
                     </form>
                </div>
            </div>
        ); 
    } 
} 
        
export default Login;