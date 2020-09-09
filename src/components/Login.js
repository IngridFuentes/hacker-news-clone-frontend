import React, { Component } from 'react'; 
// import Submit from './Submit';
import { Link } from 'react-router-dom';


class Login extends Component { 

    componentDidMount(){
        document.getElementById('nav').style.display = "none";
     };
     componentWillUnmount(){
        document.getElementById('nav').style.display = "flex";
     };
    render() { 
        return(
            <div>
                <form>
                    <p>Login</p>
                    <input type="text" placeholder="Username"/>
                    <br/>
                    <br/>
                    <input type="password" placeholder="Password"/> <br/>
                    <br/>
                    <Link to="/news">
                        <button type="submit">Login</button>
                    </Link>
                </form>
                <br/>
                <div> Or Create an account
                    <form>
                    <p>Sign up</p>
                    <input type="text" placeholder="Username"/>
                    <br/>
                    <br/>
                    <input type="email" placeholder="Email"/> <br/>
                    <br/>
                    <input type="password" placeholder="Create Password"/> <br/>
                    <br/>
                    <Link to="/news">
                        <button type="submit">Sign up</button>
                    </Link>
                    </form>
                </div>
            </div>
        ); 
    } 
} 
        
export default Login;