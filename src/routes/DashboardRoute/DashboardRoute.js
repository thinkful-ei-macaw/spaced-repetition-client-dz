import React, { Component } from 'react'
import config from '../../config'
import TokenService from '../../services/token-service'
import UserContext from '../../contexts/UserContext'
import Button from '../../components/Button/Button'
import './DashboardRoute.css'

class DashboardRoute extends Component {
  
  static contextType=UserContext;
  
  state={
    language: {name: 'Esperanto'},
    words: [{original: 'English'}],
  }

  componentDidMount(){
    return this.fetchLanguage();
  }
  
  fetchLanguage=()=>{
    return fetch(`${config.API_ENDPOINT}/language`,
    {headers:{
      authorization: `bearer ${TokenService.getAuthToken()}`
    }})
    .then((res)=> res.json())
    .then(res=>{
      this.setState({
        language: res.language,
        words: res.words
      })


    })
    .catch(err => this.setState({error:err}))
  }

 
  
  beginLearning=e=>{
    e.preventDefault();
    this.props.history.push('/learn')
  }
   
  render() {
    // const {language,words}=this.state;
    return (
      <section className="login">
      <div className="dashBoard">
      <div className="languageName">
      <h2>{this.state.language.name}</h2>
      <p>Total correct answers: {this.state.language.total_score}</p>
      </div>
      <ul>
      {this.state.words.map(word=>{ return(
      <li>
      <h4>{word.original}</h4>
      <div>
      <p>correct answer count: {word.correct_count}</p>
      <p>incorrect answer count: {word.incorrect_count}</p>
      </div>
      </li>
      )})}
      </ul>
      <div className="buttonDiv">
      <Button className="myButton" onClick={this.beginLearning}>Start Learning</Button>
      </div>
      </div>
      </section>
    );
  }
}

export default DashboardRoute
