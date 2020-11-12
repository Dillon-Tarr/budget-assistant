import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import useInputTracking from '../hooks/useInputTracking';
import { logIn } from '../actions/accountActions'
import { goToPage } from '../actions/viewActions'

function Login(props) {
  const { values, handleChange } = useInputTracking();

  const handleSubmit = e => {
    e.preventDefault();
    props.logIn(values);
  }

  return (
    <>
    <h2>Log in:</h2>
    <form>
      <label htmlFor="loginNameOrEmailAddress">
        Login name or Email address: <br/><input id="loginNameOrEmailAddress" onChange={handleChange} name="loginNameOrEmailAddress" value={values.loginNameOrEmailAddress || ""} type="text" minLength="1" maxLength="128" size="30" required/>
      </label><br/>
      <label htmlFor="password">
        Passphrase: <br/><input id="password" name="password" onChange={handleChange} value={values.password || ""} type="password" minLength="8" maxLength="50" size="30" required/>
      </label><br/><br/>
      <button onClick={handleSubmit}>Log in</button><br/><br/>
    </form>
    or...<br/><br/>
    <button onClick={() => props.goToPage("CreateAccount")}>Create an account</button>
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