import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Home from './js/Home.js';
import Tourney from './js/Tourney.js';
import io from 'socket.io-client';
let socket = io("localhost:5000")
//let socket = io("https://tourney-map.herokuapp.com");

socket.on('warning', function(data) {
  alert(data);
});

const myHome = ({history}) => {
  return (
    <Home history={history} socket={socket} />
  );
}

const myTourney = ({match}) => {
  return (
    <Tourney id={match.params.id} socket={socket} />
  );
}

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/tourneymap/home" component={myHome} />
            <Route path='/tourneymap/tourney/:id' component={myTourney} />
            <Redirect to="/tourneymap/home" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
