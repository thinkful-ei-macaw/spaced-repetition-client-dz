import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import config from '../../config'
import TokenService from '../../services/token-service'
import Button from '../../components/Button/Button'
import { Input, Label } from '../../components/Form/Form';


class LearningRoute extends Component {
  static contextType=UserContext;

  state = {
    head: '',
    total: '',
    wordCorrectCount: '',
    wordIncorrectCount: '',
    guess: '',
    answer: '',
    isCorrect: null,
    curr: ''
  };

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language/head`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res =>
      (!res.ok) ? res.json().then(e => Promise.reject(e)) 
      : res.json())
      .then(data => {
        this.setState({
          head: data.nextWord,
          total: data.totalScore,
          wordCorrectCount: data.wordCorrectCount,
          wordIncorrectCount: data.wordIncorrectCount,
          curr: data.nextWord
        })
        
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TokenService.getAuthToken()}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({guess: this.state.guess})
    })
    .then(res => 
      (!res.ok) ? res.json().then(e => Promise.reject(e)) 
      : res.json())
    .then(data => {
      this.setState({
        answer: data.answer,
        isCorrect: data.isCorrect,
        head: data.nextWord,
        total: data.totalScore,
        wordCorrectCount: data.wordCorrectCount,
        wordIncorrectCount: data.wordIncorrectCount,
        curr: this.state.head
      });
    });
  };

  handleNext = () => {
    this.setState({
      answer: '',
      guess: ''
    })
  }

  handleInput = (e) => {
    const guess = e.target.value;
    let str = guess.toLowerCase();
    this.setState({
      guess: str
    });
  };

  render() {
    let result;
    if(this.state.isCorrect === true) {
      result = <><h2 className="correct-prompt">You are correct!</h2>
      <p className="correct-answer-prompt">
      The correct translation for {this.state.curr} was {this.state.answer} and you chose {this.state.guess}!
      </p></>
    };
    if(this.state.isCorrect === false) {
      result = (
        <>
          <h2 className="incorrect-prompt">Nice try!</h2>
          <p className="correct-answer-prompt">
          The correct translation for {this.state.curr} was {this.state.answer} and you chose {this.state.guess}!
          </p>
        </>
      );
    };
    return (

      <section className="learn-section">
           <main>
        <div className="DisplayScore"><p className='total'>{`Your total score is: ${this.state.total}`}</p></div>
        <div className="check-input">
          {!this.state.answer ? (
            <>
            <h2 className="translate">Translate the word:</h2>
            <span className="next-word">{this.state.head}</span></>
            )
            : (
            <div className="DisplayFeedback">
              {this.state.isCorrect ? result: result}
            </div>
          )}
        </div>

      {!this.state.answer ? (
        <form className="word-guess-form" onSubmit={e => this.handleSubmit(e)}>
          <Label 
            htmlFor="learn-guess-input"
            className="learn-guess-label"
          >
            What's the translation for this word? 
          </Label> 
          <Input 
            id="learn-guess-input"
            type="text"
            value={this.state.guess}
            onChange={e => this.handleInput(e)}
            name="question"
            required
          />
          <Button className="submit-btn" type="submit">Submit</Button>   
        </form>
        
        ) : (
          <Button className="next-btn" onClick={this.handleNext}>Next Word</Button>
        )}
         
        {!this.state.answer ? (
          <div>
            <p className="stats">
              Answered Correctly: {this.state.wordCorrectCount} times
            </p>
            <p className="stats">
              Answered Incorrectly: {this.state.wordIncorrectCount} times
            </p>
          </div>
        ) : (
          <p className="message">Keep on keeping on!</p>
        )}
      </main>
      </section>
    );
  };


 }

export default LearningRoute;

