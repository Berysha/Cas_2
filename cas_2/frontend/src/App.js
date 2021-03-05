import './App.css';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      apiResponse: null, 
      apiResponseParsed: "",
      name: "", 
      lastName: "",
    });

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  callAPI = () => {
      const formData = {
        name: this.state.name, 
        lastName: this.state.lastName
      };
      axios
      .post('http://localhost:5000/api', formData)
      .then((response) => {
        this.setState((state) => {
          return {apiResponse: response.data.accountsInformation}}
        ); 
        this.parseAPIResponse();
      })
      .then(() => console.log('POST Request sent'))
      .catch(err => {
        console.error(err);
      }); 
  } 

  parseAPIResponse = () => {
    let parsedResponse = JSON.parse(JSON.stringify(this.state.apiResponse));
    var parsedResponseString="";
    for(var i=0;i<parsedResponse.length;i++) {
      parsedResponseString+=parsedResponse[i].name+" "+parsedResponse[i].lastName+'\n';
    } 
    console.log(parsedResponseString);
    this.setState({apiResponseParsed: parsedResponseString});
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleLastNameChange(event) {
    this.setState({lastName: event.target.value});
  }

  handleSubmit(event) {
    this.setState((state) => {
      return {name: state.name.trim(), lastName: state.lastName.trim()};
    });
    if(this.state.name.length==0 || this.state.lastName.length==0) {
      alert("Please fill in the credentials!");
      return;
    }
    alert("Name " + this.state.name + " and last name " + this.state.lastName + " are going to be sent!");
    event.preventDefault();
    this.callAPI(); 
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            Name: 
            <input type="text" value={this.state.name} onChange={this.handleNameChange}/><br/>
            Last name:
            <input type="text" value={this.state.value} onChange={this.handleLastNameChange}/><br/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        {this.state.apiResponseParsed.split('\n').map(
          function(item, key) {
          return (
            <span key={key}>
              {item}
              <br/>
            </span>
          )
          })
        }
      </div>
    );
  }
}

export default App;
