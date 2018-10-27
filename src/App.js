import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PostcodeInput from "./postcode/postcode.input";
import PointComponent from './crime/PointComponent';
import MyMapComponent from './map/Map';

class App extends Component {

  state = {
    postcodeLatLong: [0,0],
    isMarkerShown: false
  }

  setLatLong(lat, long) {
    this.setState({
      postcodeLatLong: [lat, long]
    })
  }

  enableMarker(){
      this.setState({
          isMarkerShown: true
      })
  }


  render() {
      const fakeParkingSpots = [
              {
                  lat: 53.480078,
                  long:  -2.236291
              },
          {
              lat: 53.478769,
              long: -2.238260
          },
          {
              lat: 53.480723,
              long: -2.239417
          }
      ]


    return (
      <div className="Safe Parka">
          <PostcodeInput setLatLong={(lat, long) => this.setLatLong(lat, long)} enableMarker={()=> this.enableMarker()}/>

          <MyMapComponent
              isMarkerShown={ this.state.isMarkerShown }
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxjOZ_DHOBrb_zRdVsXb2vfsUghJp6RzA&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `150%` }} />}
              containerElement={<div style={{ height: `700px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              postocodeLatLong={this.state.postcodeLatLong}
              parkingSpots={fakeParkingSpots}
          />

          <PointComponent postcodeLatLong={this.state.postcodeLatLong} />
      </div>
    );
  }
}

export default App;
