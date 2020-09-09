import React from 'react';
import Home from './components/Home.js';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import New from './components/New.js';
import Past from './components/Past.js';
import Comments from './components/Comments.js';
import Submit from './components/Submit.js';
import Login from './components/Login.js';
// import fire from './fire';
// import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

class App extends React.Component {
  // componentWillMount(){
  //   /* Create reference to messages in Firebase Database */
  //   let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
  //   messagesRef.on('child_added', snapshot => {
  //     /* Update React state when message is added at Firebase Database */
  //     let message = { text: snapshot.val(), id: snapshot.key };
  //     this.setState({ messages: [message].concat(this.state.messages) });
  //   })
  // } 
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
  
  // <body>
  //      <!-- The core Firebase JS SDK is always required and must be listed first -->
  //         <script src="/__/firebase/7.19.1/firebase-app.js"></script>

  //         <!-- TODO: Add SDKs for Firebase products that you want to use
  //             https://firebase.google.com/docs/web/setup#available-libraries -->

  //         <!-- Initialize Firebase -->
  //         <script src="/__/firebase/init.js"></script>
  // </body>

}

export default App;
