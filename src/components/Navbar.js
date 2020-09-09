import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component{
    render() {
        return (
            <div>
              <ul id="nav">
                <li><a href="#">Hacker News</a></li>
                <Link to="/newest"><li><a >New</a></li></Link>
                <Link to="/past"><li><a>Past</a></li></Link>
                <Link to="/newcomments"><li><a>Comment</a></li></Link>
                <Link to="/submit"><li><a>Submit</a></li></Link>
                <Link to="/login"><li><a className="login">Login</a></li></Link>
              </ul>
            </div>
        );
    }
}

export default Navbar;