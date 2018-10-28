/* global google */
import React from 'react'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer, Marker, } from "react-google-maps"
import carParkImage from './park-50.png'

class MyMappComponent extends React.Component{

    state = {
        directions: null
    }

    componentDidUpdate() {
        if (this.props.isDestinationShown) {
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
            origin: new google.maps.LatLng(this.props.directionOrigin[0], this.props.directionOrigin[1]),
            destination: new google.maps.LatLng(this.props.directionDestination[0], this.props.directionDestination[1]),
            travelMode: google.maps.TravelMode.WALKING,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: result,
                });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }
    }

    render() {
        const defaultLat = this.props.postocodeLatLong[0] ? this.props.postocodeLatLong[0] : 53.483959
        const defaultLong = this.props.postocodeLatLong[1] ? this.props.postocodeLatLong[1] : -2.244644
        
        return (
            <GoogleMap
                center={{ lat: defaultLat, lng:  defaultLong }}
                zoom={this.props.postocodeLatLong[0] ? 15: 13}
                onClick={event => this.props.onClick(event.latLng.lat(), event.latLng.lng())}
            >
                {
                    this.props.isMarkerShown &&
                    <Marker
                        position={{
                            lat: this.props.postocodeLatLong[0],
                            lng: this.props.postocodeLatLong[1]
                        }}
                    >
                    </Marker>
                }
                {
                    this.props.isMarkerShown &&
                        this.props.parkingSpots.map((parkSpot,index) => {
                            return <Marker
                                key={index}
                                position={{
                                    lat: parkSpot.lat,
                                    lng: parkSpot.long
                                }}
                                icon={carParkImage}
                            >
                            </Marker>
                        })
                }
                {
                    <HeatmapLayer
                        dissipate={false}
                        data={this.props.crimeSpots.map(
                            crime => ({
                                location: new google.maps.LatLng(crime.latLong[0], crime.latLong[1]),
                                weight: Math.pow(2, Math.floor(Math.random() * Math.floor(6)))
                            })
                        )}
                    />
                }
                {
                    this.state.directions && this.props.isDestinationShown && <DirectionsRenderer directions={this.state.directions} />
                }
            </GoogleMap>

        )
    }
}

export default withScriptjs(withGoogleMap(MyMappComponent))