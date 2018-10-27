import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 53.483959, lng:  -2.244644 }}
    >
        {props.isMarkerShown && <Marker position={{ lat: props.postocodeLatLong[0], lng: props.postocodeLatLong[1] }}  onClick={props.onMarkerClick}/>}
    </GoogleMap>
))

export default MyMapComponent