import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import { logIn } from '../../actions/accountActions'
import { goToPage } from '../../actions/viewActions'
import Title from '../Title';

function Login(props) {
  const { values, handleChange } = useInputTracking();
  let counter = 0;
  const handleSubmit = () => {
    if(!values.loginNameOrEmailAddress || !values.password) $("#invalid-login").html("Please fill in both fields.").css('display', 'inline');
    else {
      $("#invalid-login").html("Logging in...").css('display', 'inline');
      props.logIn(values);
      setTimeout(() => {
        $("#invalid-login").html("Invalid login. Please try again.").css('display', 'inline');
        if (counter >= 5) $("#forgot-passphrase").css('display', 'inline');
        counter++;
      }, 2500);
      
    }
  }

  return (
    <>
    <Title/>
    <h2>Log in:</h2>
    <form>
      <label htmlFor="loginNameOrEmailAddress">
        Login name or Email address: <br/><input id="loginNameOrEmailAddress" onChange={handleChange} name="loginNameOrEmailAddress"
        value={values.loginNameOrEmailAddress || ""} type="text" minLength="1" maxLength="128" size="30" required autoFocus/>
      </label><br/>
      <label htmlFor="password">
        Passphrase: <br/><input id="password" name="password" onChange={handleChange} onKeyPress={event => {if (event.key === 'Enter') handleSubmit()}}
        value={values.password || ""} type="password" minLength="8" maxLength="50" size="30" required/>
      </label><br/>
      <p id="forgot-passphrase">Forgot passphrase?<br/>
      Email me: dill.tarr@gmail.com<br/></p>
      <p id="invalid-login">Logging in...</p><br/><br/>
      <button className="main-button" type="button" onClick={handleSubmit}>Log in</button><br/>
    </form>
    or...<br/><br/>
    <button className="main-button" type="button" onClick={() => props.goToPage("CreateAccount")}>Create an account</button>
    </>
  )
}

const mapDispatchToProps = {
  logIn,
  goToPage
}

Login.propTypes = {
  logIn: PropTypes.func.isRequired,
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Login);