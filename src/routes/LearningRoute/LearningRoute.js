import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import config from '../../config'
import TokenService from '../../services/token-service'
// import Button from '../../components/Button/Button'


class LearningRoute extends Component {
  static contextType=UserContext;

  state={
    language: {name: 'Esperanto'},
    words: [{original: 'English'}],
  }

  componentDidMount(){
    return this.fetchLanguage();
  }

  fetchLanguage=()=>{
    return fetch(`${config.API_ENDPOINT}/language/head`,
    {headers:{
      authorization: `bearer ${TokenService.getAuthToken()}`
    }})
    .then((res)=> res.json())
    .then(res=>{
      this.setState({
        language: res.language,
        words: res.words,
        nextWord: res.nextWord.original,
        totalScore: res.req.language.total_score,
        wordCorrectCount: res.nextWord.correct_count,
        wordIncorrectCount: res.nextWord.incorrect_count
      })


    })
    .catch(err => this.setState({error:err}))
  }

  render() {
    return (
      <section>
        <h2>{this.state.language.total_score}</h2>
        <h2>Translate the word:{this.state.nextWord}</h2>
        <span></span>
        <p>Your total score is: {this.state.totalScore}</p>
        <main>You have answered this word correctly:{this.state.correct_count} times</main>
        <main>You have answered this word incorrectly 333 times:{this.state.incorrect_count}</main>
        <form>
          <label htmlFor="learn-guess-input">What's the translation for this word?</label>
          <input id="learn-guess-input" name="learn-guess-input" onClick={this.handleGuess} type="text" required></input>
          <button type="submit">Submit your answer</button>
        </form>
      </section>
    );
  }
}

export default LearningRoute
