import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import carParkImage from './park-50.png'


const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap defaultZoom={10}
               defaultCenter={{ lat: 53.483959, lng:  -2.244644 }}>
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
))

export default MyMapComponent