import React from 'react';
import Home from './components/Home.js';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import New from './components/New.js';
import Past from './components/Past.js';
import Comments from './components/Comments.js';
import Submit from './components/Submit.js';
import Login from './components/Login.js';
// import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

class App extends React.Component {
  render() {
  return (
    <div>
      
      <Navbar/>
      <Switch>
    
       {/* <Route exact path="/" component={Home} /> */}
       <Route exact path="/news" component={Home} />
       <Route exact path="/newest" component={New} />
       <Route exact path="/past" component={Past} />
       <Route exact path="/newcomments" component={Comments} />
       <Route exact path="/submit" component={Submit} />
       <Route exact path="/login" component={Login} />
       </Switch>

    </div>
   
  );
  }
}

export default App;
