import React, { Component } from 'react';
import './App.css';
import PostcodeInput from "./postcode/postcode.input";
import PointComponent from './crime/PointComponent';
import MyMapComponent from './map/Map';

class App extends Component {

  state = {
    postcodeLatLong: [0,0],
    isMarkerShown: false,
    parkingSpots: [],
    crimeSpots: [],
    selectedLatLongDestination: false
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

  setCrimeSpots(crimeSpots) {
    this.setState({
      crimeSpots: crimeSpots
    })
  }

  enableMarker(){
      this.setState({
          isMarkerShown: true
      })
  }

  setSelectedLatLongDestination(latLong) {
    this.setState({
      selectedLatLongDestination: latLong
  })
  }


  render() {
    return (
      <div className="Safe Parka">
      <h1 className="text-center">Safe Parka</h1>
          <PostcodeInput setLatLong={(lat, long) => this.setLatLong(lat, long)} enableMarker={()=> this.enableMarker()}/>

          <div className="App-map-box">
          <MyMapComponent
              isMarkerShown={this.state.isMarkerShown}
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxjOZ_DHOBrb_zRdVsXb2vfsUghJp6RzA&v=3.exp&libraries=geometry,drawing,places,visualization"
              loadingElement={<div style={{ height: `150%` }} />}
              containerElement={<div style={{ height: `700px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              postocodeLatLong={this.state.postcodeLatLong}
              parkingSpots={this.state.parkingSpots}
              directionOrigin={this.state.selectedLatLongDestination}
              directionDestination={this.state.postcodeLatLong}
              isDestinationShown={!!this.state.selectedLatLongDestination}
              crimeSpots={this.state.crimeSpots}
          />
          </div>

          <PointComponent postcodeLatLong={this.state.postcodeLatLong}
                          setParkingSpots={a => this.setParkingSpots(a)}
                          setCrimeSpots={b => this.setCrimeSpots(b)}
                          crimeLatLongs={this.state.crimeSpots} 
                          setSelectedLatLongDestination={(a) => this.setSelectedLatLongDestination(a)}
                          />
      </div>
    );
  }
}

export default App;
