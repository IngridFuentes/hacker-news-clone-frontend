import React from 'react';
import Home from './components/Home.js';
import { Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

class App extends React.Component {
  render() {
  return (
    <div>
       <Route exact path="/" component={Home} />
    </div>
  );
  }
}

export default App;
