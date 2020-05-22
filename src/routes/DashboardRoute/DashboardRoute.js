import React, { Component } from 'react'
import config from '../../config'
import TokenService from '../../services/token-service'
import UserContext from '../../contexts/UserContext'
import Button from '../../components/Button/Button'

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

 

  // DisplayListWords(props){
  //   return(
  //     <li>
  //     <h4>{props.word.original}</h4>
  //     <div>
  //     <p>correct answer count: {props.word.correct_count}</p>
  //     <p>incorrect answer count: {props.word.incorrect_count}</p>
  //     </div>
  //     </li>
  //   )
  // }

  // listWords(words){
  //   let list=[];
  //   words.forEach((original,translation)=>{
  //     list.push(<DisplayListWords key={original} value={translation}/>);
  //   })
  //   return <li>{list}</li>

  // }
  
  beginLearning=e=>{
    e.preventDefault();
    this.props.history.push('/learn')
  }
   
  render() {
    // const {language,words}=this.state;
    return (
      <section className="dashboard">
      <div>
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
      <div>
      <Button className="learning" onClick={this.beginLearning}>Start Learning</Button>
      </div>
      </section>
    );
  }
}

export default DashboardRoute
