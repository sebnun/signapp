import React, { Component } from 'react';
import getFeedback from '../feedback';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordValue: '',
      emailValue: '',
      hasLeftEmailInput: false,
      feedback: null,
      ignoreThisEmail: false
    }
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailBlur = this.handleEmailBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailCorrection = this.handleEmailCorrection.bind(this);
    this.handleEmailRejection = this.handleEmailRejection.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('submitted!');
  }

  handleEmailChange(event) {
    this.setState({ emailValue: event.target.value, ignoreThisEmail: false });
  }

  handlePasswordChange(event) {
    this.setState({ passwordValue: event.target.value });
  }

  handleEmailBlur() {
    this.setState({ hasLeftEmailInput: true });
  }

  componentDidUpdate() {
    //this is in charge of updating the feedback state after the user has moved from the email input
    if (this.state.hasLeftEmailInput && !this.state.ignoreThisEmail) {
      const feedback = getFeedback(this.state.emailValue)

      if (JSON.stringify(this.state.feedback) !== JSON.stringify(feedback)) 
        this.setState({ feedback })
    }
  }

  handleEmailCorrection() {
    this.setState({ emailValue: this.state.feedback.suggestion });
  }

  handleEmailRejection() {
    this.setState({ feedback: null, ignoreThisEmail: true }); //to prevent checks on current "wrong" email
  }

  render() {
    let feedbackElement = <div></div>;
    let className = '';
    if (this.state.feedback && this.state.feedback.type === 'error') {
      className = 'error';
      feedbackElement = <div><label className={className} htmlFor="emailinput">{`${this.state.feedback.message}`}</label></div>
    } else if (this.state.feedback && this.state.feedback.type === 'warning') {
      className = 'warning';
      feedbackElement = <div>
        <label className={className} htmlFor="emailinput">
          Did you mean <button className="text" onClick={this.handleEmailCorrection}>{this.state.feedback.suggestion}</button>?&nbsp; 
          {this.state.feedback.isValidEmail ? <button className="text" onClick={this.handleEmailRejection}>No</button> : null }
        </label>
      </div>
    }

    return (
      <div className="container">
        <div className="loginform">
          <h1>Welcome!</h1>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="emailinput">Email</label>
            <input
              onBlur={this.handleEmailBlur}
              placeholder='type your email'
              id="emailinput"
              type="email"
              autoFocus
              value={this.state.emailValue}
              onChange={this.handleEmailChange}
              className={className}
            />
            {feedbackElement}

            <label htmlFor="passwordinput">Password</label>
            <input
              id='passwordinput'
              type="password"
              placeholder="type your password"
              value={this.props.passwordValue}
              onChange={this.handlePasswordChange}
            />

            <input type="submit" value="Signup" disabled={this.state.feedback !== null || this.state.passwordValue === ''} />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
