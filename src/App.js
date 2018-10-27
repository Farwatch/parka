import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PostcodeInput from "./postcode/postcode.input";
import PointComponent from './PointComponent'

class App extends Component {
  render() {
    return (
      <div className="App">
          <PostcodeInput />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <PointComponent />
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
