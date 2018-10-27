import React, { Component } from 'react';
import rbush from 'rbush';
import knn from 'rbush-knn';
import fetch from 'isomorphic-fetch'

class PointComponent extends Component {
    state = {
        latLongs: [0, 1],
        picGardens: [53.4810, -2.2369]
      }
    
    async componentDidMount() {
        const latLongs = await fetchCrimeData(this.state.picGardens)
        this.setState({
            latLongs: latLongs
        })
    }

    render() {

       
    
        const tree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
    
        tree.load(this.state.latLongs)
    
        const nearest = knn(tree, 53.4810, -2.2369, 3);

        const distances = nearest.map(point => computePythagDistance(point, this.state.picGardens))
    
    
        return (
              <div>
                nearest: { nearest[0] + ', ' + nearest[1] + ', ' + nearest[2] }
                distances: {distances[0] + ', ' + distances[1] + ', ' + distances[2]}
                score: {'score: ' + computeAverageScore(distances)}
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
  