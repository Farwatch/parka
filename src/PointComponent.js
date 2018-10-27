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
        let nearest, distances
       
        if (this.state.crimeLatLongs) {
    
            const tree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
        
            tree.load(this.state.crimeLatLongs)
        
            nearest = knn(tree, this.props.postcodeLatLong[0], this.props.postcodeLatLong[1], 3);

            distances = nearest.map(point => computePythagDistance(point, this.props.postcodeLatLong))
        }
    
    
        return (
              <div>
                  { distances &&
                    <div>
                        nearest: { nearest[0] + ', ' + nearest[1] + ', ' + nearest[2] }
                        distances: {distances[0] + ', ' + distances[1] + ', ' + distances[2]}
                        score: {computeAverageScore(distances)}
                    </div>
                  }
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
  