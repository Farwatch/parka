import React from 'react'
import postcodesioClient from 'postcodesio-client'
import './../App.css';


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
        })
    }


    handleChange(event) {
        this.setState({postcode: event.target.value});
    }

    render () {

        let submitButton
        if(this.state.postcode === "" ){
            submitButton = <input disabled={true} type="submit" value="Submit" onClick={this.handleSubmit}/>
        }
        else{
            submitButton = <input type="submit" value="Submit" onClick={this.handleSubmit}/>
        }

        return <form>
            <label>
                Postcode:
                <input type="text"
                       className="App-postocde"
                       value={this.state.postcode}
                       placeholder="Insert a postcode"
                       onChange={this.handleChange}
                       />
            </label>
            {
                submitButton
            }
        </form>
    }
}

export default PostcodeInput


