import React, { Component } from 'react';
import rbush from 'rbush';
import knn from 'rbush-knn';
import fetch from 'isomorphic-fetch'

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
        }
    }

    render() {
    
        let nearestSpacesWithScores 

        const parkingTree = rbush(0, ['[0]', '[1]', '[0]', '[1]']);

        parkingTree.load(fakeParkingData.map(space => space.latLong))

        const nearestSpaces = knn(parkingTree, this.props.postcodeLatLong[0], this.props.postcodeLatLong[1], 10)
       
        if (this.state.crimeLatLongs) {
    
            const crimeTree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
        
            crimeTree.load(this.state.crimeLatLongs)

            nearestSpacesWithScores = nearestSpaces.map(space => {
                const nearest = knn(crimeTree, space[0], space[1], 5);

                const distances = nearest.map(point => computePythagDistance(point, space))

                const score = computeAverageScore(distances)
                const name = fakeParkingData.find(element => element.latLong === space).name

                return { 'latLong': space, score, name }
            })

            nearestSpacesWithScores.sort((elementA, elementB) => elementB.score - elementA.score)

            nearestSpacesWithScores = nearestSpacesWithScores.slice(0,1)
        }
    
    
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




const fakeParkingData = [
    {
        latLong: [53.4810, -2.2369],
        name: 'pic'
    },
    {
        latLong: [53.4815, -2.2365],
        name: 'not pic'
    },
    {
        latLong: [53.4819, -2.2359],
        name: 'maybe pic'
    }
]
  