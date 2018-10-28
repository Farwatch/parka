import React, { Component } from 'react';
import rbush from 'rbush';
import knn from 'rbush-knn';
import fetch from 'isomorphic-fetch'
import ParkingData from '../resources/parking_spaces'
import Form from 'react-bootstrap/lib/Form'
import Radio from 'react-bootstrap/lib/Radio'
import FormGroup from 'react-bootstrap/lib/FormGroup'

class PointComponent extends Component {
    state = {
        nearestSpacesWithScores: false,
    }
    
    async componentDidUpdate(prevProps) {
        if (this.props.postcodeLatLong !== prevProps.postcodeLatLong) {
            const crimes = await fetchCrimeData(this.props.postcodeLatLong)
            this.props.setCrimeSpots(crimes)

            let nearestSpacesWithScores 

            const parkingTree = rbush(0, ['[0]', '[1]', '[0]', '[1]']);
    
            parkingTree.load(ParkingData.map(space => [space.lat, space.lng]))
    
            const nearestSpaces = knn(parkingTree, this.props.postcodeLatLong[0], this.props.postcodeLatLong[1], 10)
           
            if (this.props.crimeLatLongs) {
        
                const crimeTree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
            
                crimeTree.load(this.props.crimeLatLongs)
    
                nearestSpacesWithScores = nearestSpaces.map(space => {
                    const nearest = knn(crimeTree, space[0], space[1], 5);
    
                    const distances = nearest.map(point => computePythagDistance(point, space))
    
                    const score = computeAverageScore(distances)
                    const spaceInOriginalData = ParkingData.find(element => {return element.lat === space[0] && element.lng === space[1]})
                    const name = spaceInOriginalData && spaceInOriginalData['street_name']

    
                    return { 'latLong': space, score, name }
                })
    
                nearestSpacesWithScores.sort((elementA, elementB) => elementB.score - elementA.score)
    
                nearestSpacesWithScores = nearestSpacesWithScores.slice(0,3)

                this.setState({
                    nearestSpacesWithScores: nearestSpacesWithScores
                })
    
                this.props.setParkingSpots(nearestSpacesWithScores.map(space => ({lat: space.latLong[0], long: space.latLong[1]})))
            }
        }
    }

    render() {
        const { nearestSpacesWithScores } = this.state
        const { setSelectedLatLongDestination, selectedLatLongDestination } = this.props
    
        return (
            <Form>
            <FormGroup>
                { nearestSpacesWithScores && nearestSpacesWithScores.map((space, i) => 
                    <span key={i}>
                        <Radio name="radioGroup" 
                            id={space.name}
                            className='hidden'
                            key={space.name} 
                            onChange={() => setSelectedLatLongDestination(space.latLong)}
                        />
                        <label htmlFor={space.name}  className={`${selectedLatLongDestination === space.latLong && 'selected'} parking-result`}>
                            <h3>{space.name}</h3>
                            <p>Safety score: {convertToDisplayScore(space.score)}</p>
                        </label>    
                    </span>
                )}
              </FormGroup>
            </Form>
        )
    }
}

const fetchCrimeData = async (point) => fetch(`https://data.police.uk/api/crimes-street/vehicle-crime?lat=${point[0]}&lng=${point[1]}`)
    .then(response => Promise.resolve(response.json())
    .then(body => body.map(
        crime => ({ latLong: [crime.location.latitude, crime.location.longitude], date: crime.month })
    ))
);

const computePythagDistance = (point1, point2) => {
    const diffX = Math.abs(point2[0]) - Math.abs(point1[0])
    const diffY = Math.abs(point2[1]) - Math.abs(point1[1])
  
    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
  }  

const computeAverageScore = values => {
    return values.length > 0 ? values.reduce((a, c) => a + c) / values.length : 0
}  

const convertToDisplayScore = score => {
    return Math.round( score * 100000) / 10
}

export default PointComponent
