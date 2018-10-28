import React, { Component } from 'react';
import ReactSwipeEvents from 'react-swipe-events'
import rbush from 'rbush';
import knn from 'rbush-knn';
import fetch from 'isomorphic-fetch'
import ParkingData from '../resources/parking_spaces'
import Form from 'react-bootstrap/lib/Form'
import Radio from 'react-bootstrap/lib/Radio'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import Gauge from 'react-svg-gauge';

class PointComponent extends Component {
    state = {
        nearestSpacesWithScores: false,
        swipeDist0: 0,
        swipeDist1: 0,
        swipeDist2: 0,
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

    setSwipeDist = (dist, i) => {
        this.setState({ [`swipeDist${i}`]: dist })
    }

    doGoogNav = streetName => {}

    render() {
        const { nearestSpacesWithScores } = this.state
        const { setSelectedLatLongDestination, selectedLatLongDestination } = this.props
    
        return (
            <Form>
            <FormGroup>
                { nearestSpacesWithScores && nearestSpacesWithScores.map((space, i) => 
                    <ReactSwipeEvents
                        key={i}
                        onSwiping={(e, originalX, originalY, currentX, currentY, deltaX, deltaY) => 
                            this.setSwipeDist(deltaX, i)
                        }
                        onSwiped={(e, originalX, originalY, endX, endY, deltaX, deltaY) => {
                            this.setSwipeDist(0, i)
                        }}>
                        { this.state[`swipeDist${i}`] > -50 ?
                            <span>
                                <Radio name="radioGroup" 
                                    id={space.name}
                                    className='hidden'
                                    key={space.name} 
                                    onChange={() => setSelectedLatLongDestination(space.latLong)}
                                />
                                <label htmlFor={space.name}
                                className={`${selectedLatLongDestination === space.latLong && 'selected'} parking-result`}>
                                    <h3>{space.name}</h3>
                                    <p>Distance: {this.props.distanceBetweenOriginDestination[i]} meters</p>
                                    <span style={{float:'right', 'margin-top':'-50px'}}>
                                        <Gauge label='' 
                                            height={50} 
                                            width={60} 
                                            value={to2dp((convertToDisplayScore(space.score)/40) * 100)}
                                            color={getDialColourForValue(convertToDisplayScore(space.score))}
                                            minMaxLabelStyle={{display: 'none'}}
                                            backgroundColor='#000000'
                                            />
                                    </span>
                                </label>    
                            </span> : 
                            <a className='parking-result link-thing'
                                href={`https://www.google.com/maps/dir/?api=1&${encodeURIComponent(space.name)}`}>{`Get directions to ${space.name} =>`}
                            </a>
                        }
                    </ReactSwipeEvents>
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

const to2dp = value => Math.round(value * 100) / 100

const convertToDisplayScore = score => {
    return Math.round( score * 100000) / 10
}

const getDialColourForValue = value => {
    if (value < 10) return '#f44336';
    if (value < 20) return '#ff9800';
    if (value < 30) return '#fFCc00';
    return '#4CAF50';
}

export default PointComponent
