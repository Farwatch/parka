import React from 'react'
import postcodesioClient from 'postcodesio-client'
import './../App.css';
import Form from 'react-bootstrap/lib/Form'
import FormControl from 'react-bootstrap/lib/FormControl'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Button from 'react-bootstrap/lib/Button'



class PostcodeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postcode: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let postcode = new postcodesioClient()

        postcode.lookup(this.state.postcode).then(postcode => {
            console.log(postcode);
            this.props.setLatLong(postcode.latitude, postcode.longitude)
            this.props.enableMarker()
        })
    }


    handleChange(event) {
        this.setState({postcode: event.target.value});
    }

    render () {

        let submitButton
        if(this.state.postcode === "" ){
            submitButton = <Button size="lg" className="App-postocde" bsStyle="primary" disabled={true} type="submit">Submit</Button>
        }
        else{
            submitButton = <Button size="lg" className="App-postocde" bsStyle="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
        }

        return <Form>
            <FormGroup>
                <FormControl type="text"
                        bsSize="lg"
                        className="App-postocde"
                        value={this.state.postcode}
                        placeholder="Insert a postcode"
                        onChange={this.handleChange}
                        />
                
                {
                    submitButton
                }
            </FormGroup>
        </Form>
    }
}

export default PostcodeInput


