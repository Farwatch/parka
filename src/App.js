import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PostcodeInput from "./postcode/postcode.input";
import PointComponent from './PointComponent'
import MyMapComponent from './map/Map'

class App extends Component {

  state = {
    postcodeLatLong: [0,0],
  }

  setLatLong(lat, long) {
    this.setState({
      postcodeLatLong: [lat, long]
    })
  }

  render() {
    return (
      <div className="App">
          <PostcodeInput setLatLong={(lat, long) => this.setLatLong(lat, long)} />
          <div>
            <PointComponent latLong={this.state.postcodeLatLong} />
          </div>
          <MyMapComponent
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxjOZ_DHOBrb_zRdVsXb2vfsUghJp6RzA&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `50%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              postocodeLatLong={this.state.postcodeLatLong}
          />
      </div>
    );
  }
}

export default App;
