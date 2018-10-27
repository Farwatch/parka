import React, { Component } from 'react';
import './App.css';
import PostcodeInput from "./postcode/postcode.input";
import PointComponent from './crime/PointComponent';
import MyMapComponent from './map/Map';

class App extends Component {

  state = {
    postcodeLatLong: [0,0],
    isMarkerShown: false,
    parkingSpots: []
  }

  setLatLong(lat, long) {
    this.setState({
      postcodeLatLong: [lat, long]
    })
  }

  setParkingSpots(parkingSpots) {
    this.setState({
      parkingSpots: parkingSpots
    })
  }

  enableMarker(){
      this.setState({
          isMarkerShown: true
      })
  }


  render() {
    return (
      <div className="Safe Parka">
      <h1 className="text-center">Safe Parka</h1>
          <PostcodeInput setLatLong={(lat, long) => this.setLatLong(lat, long)} enableMarker={()=> this.enableMarker()}/>

          <MyMapComponent
              isMarkerShown={ this.state.isMarkerShown }
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxjOZ_DHOBrb_zRdVsXb2vfsUghJp6RzA&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `150%` }} />}
              containerElement={<div style={{ height: `700px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              postocodeLatLong={this.state.postcodeLatLong}
              parkingSpots={this.state.parkingSpots}
          />

          <PointComponent postcodeLatLong={this.state.postcodeLatLong} setParkingSpots={(a) => this.setParkingSpots(a)} />
      </div>
    );
  }
}

export default App;
