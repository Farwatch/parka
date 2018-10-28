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
    selectedLatLongDestination: false,
    distanceBetweenOriginDestination: []
  }

  setLatLong(lat, long) {
    window.scrollTo(0, 3000)
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
  })}


    setDistancesBetweenOriginDestination(distance, i) {
      let distanceArray = this.state.distanceBetweenOriginDestination;
      distanceArray[i] = (distance);
        this.setState({
            distanceBetweenOriginDestination: distanceArray
        })}



  render() {
    return (
      <div className="App">
          <h1 className="text-center App-h1"><img src="park-50.png" alt=""/>SafeParka</h1>
          <PostcodeInput setLatLong={(lat, long) => this.setLatLong(lat, long)} enableMarker={()=> this.enableMarker()}/>

          <div className="App-map-box">
          <MyMapComponent
              isMarkerShown={this.state.isMarkerShown}
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxjOZ_DHOBrb_zRdVsXb2vfsUghJp6RzA&v=3.exp&libraries=geometry,drawing,places,visualization"
              loadingElement={<div style={{ height: `150%` }} />}
              containerElement={<div style={{ height: `300px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              postocodeLatLong={this.state.postcodeLatLong}
              parkingSpots={this.state.parkingSpots}
              directionOrigin={this.state.selectedLatLongDestination}
              directionDestination={this.state.postcodeLatLong}
              isDestinationShown={!!this.state.selectedLatLongDestination}
              crimeSpots={this.state.crimeSpots}
              setDistanceBetweenOriginDestination = {(distances, i) => this.setDistancesBetweenOriginDestination(distances, i)}
              onClick={(lat, long) => {
                this.setLatLong(lat, long)
                this.enableMarker()
              }}
          />
          </div>

          <PointComponent postcodeLatLong={this.state.postcodeLatLong}
                          setParkingSpots={a => this.setParkingSpots(a)}
                          setCrimeSpots={b => this.setCrimeSpots(b)}
                          crimeLatLongs={this.state.crimeSpots.map(crime => crime.latLong)}
                          setSelectedLatLongDestination={(a) => this.setSelectedLatLongDestination(a)}
                          distanceBetweenOriginDestination={this.state.distanceBetweenOriginDestination}
                          selectedLatLongDestination={this.state.selectedLatLongDestination}
                          />

          />
      </div>
    );
  }
}

export default App;
