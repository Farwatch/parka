import React, { Component } from 'react';
import rbush from 'rbush';
import knn from 'rbush-knn';
import fetch from 'isomorphic-fetch'
import ParkingData from '../resources/parking_spaces'

class PointComponent extends Component {
    state = {
        crimeLatLongs: false,
        picGardens: [53.4810, -2.2369]
    }
    
    async componentDidUpdate(prevProps) {
        if (this.props.postcodeLatLong !== prevProps.postcodeLatLong) {
            const crimeLatLongs = await fetchCrimeData(this.props.postcodeLatLong)
            this.setState({
                crimeLatLongs: crimeLatLongs
            })

            let nearestSpacesWithScores 

            const parkingTree = rbush(0, ['[0]', '[1]', '[0]', '[1]']);
    
            parkingTree.load(ParkingData.map(space => [space.lat, space.lng]))
    
            const nearestSpaces = knn(parkingTree, this.props.postcodeLatLong[0], this.props.postcodeLatLong[1], 10)
           
            if (this.state.crimeLatLongs) {
        
                const crimeTree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
            
                crimeTree.load(this.state.crimeLatLongs)
    
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
    
    
        return (
              <div>
                 { nearestSpacesWithScores && nearestSpacesWithScores.map(space => 
                    <div>
                        <p>{space.name}</p>
                        <p>{space.latLong}</p>
                        <p>{space.score}</p>
                    </div>
                 ) }
              </div>
        )

      }

}

const fetchCrimeData = async (point) => fetch(`https://data.police.uk/api/crimes-street/vehicle-crime?lat=${point[0]}&lng=${point[1]}`)
  .then(response => {
    return Promise.resolve(response.json()).then(
      body => body.map(crime => [crime.location.latitude, crime.location.longitude])
    )
  });

const computePythagDistance = (point1, point2) => {
    const diffX = Math.abs(point2[0]) - Math.abs(point1[0])
    const diffY = Math.abs(point2[1]) - Math.abs(point1[1])
  
    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
  }  

const computeAverageScore = (values) => {
    return values.length > 0 ? values.reduce((a, c) => a + c) / values.length : 0
}  

export default PointComponent
