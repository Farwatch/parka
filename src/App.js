import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PostcodeInput from "./postcode/postcode.input";
import PointComponent from './PointComponent'

class App extends Component {

  state = {
    latLong: [0,0]
  }

  setLatLong(lat, long) {
    this.setState({
      latLong: [lat, long]
    })
  }

  render() {
    return (
      <div className="App">
          <PostcodeInput setLatLong={(lat, long) => this.setLatLong(lat, long)} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <PointComponent latLong={this.state.latLong} />
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
