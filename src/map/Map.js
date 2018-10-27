import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import carParkImage from './park-50.png'


const MyMapComponent = withScriptjs(withGoogleMap((props) => {
    const defaultLat = props.postocodeLatLong[0] ? props.postocodeLatLong[0] : 53.483959
    const defaultLong = props.postocodeLatLong[1] ? props.postocodeLatLong[1] : -2.244644
    return (
        <GoogleMap 
                center={{ lat: defaultLat, lng:  defaultLong }}
                zoom={props.postocodeLatLong[0] ? 15: 10}
                >
            {
                props.isMarkerShown &&
                <Marker
                    position={{
                    lat: props.postocodeLatLong[0],
                    lng: props.postocodeLatLong[1]
                }}
                >
                </Marker>
            }
            {
                props.isMarkerShown ?
                    props.parkingSpots.map((parkSpot,index) => {
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
                    :
                    null
            }
        </GoogleMap>
    )
        }))


export default MyMapComponent