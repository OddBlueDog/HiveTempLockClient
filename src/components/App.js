import React from "react";
import RegistrationForm from "./RegistrationForm";
import DeleteForm from "./DeleteForm";
import Privacy from "./Privacy";
import MainNavbar from "./MainNavbar";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="container">
          <MainNavbar />
          <Route exact path="/" component={RegistrationForm} />
          <Route path="/delete" component={DeleteForm} />

          <div className="jumbotron">
            <h1 class="display-4">Source Code</h1>
            <p>All source code for this project is public on github</p>
            <a href="https://github.com/OddBlueDog/HiveTempLockClient" target="_blank" className="btn btn-primary mr-3">
              Client
            </a>
            <a href="https://github.com/OddBlueDog/HiveTempLockServer" target="_blank" className="btn btn-primary">
              Server
            </a>
          </div>
          <Privacy />
        </div>
      </Router>
    );
  }
}

export default App;
