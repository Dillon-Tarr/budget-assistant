import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import { createAccount } from '../../actions/accountActions'
import { goToPage } from '../../actions/viewActions'
import Title from '../Title';

function CreateAccount(props) {
  const { values, handleChange } = useInputTracking();

  const handleSubmit = e => {
    if (!values.password1 || !values.password2) {
      $("#bad-passphrase").html("Passphrase must be entered twice.").css('display', 'inline');
    }
    else if (values.password1.length < 8){
      $("#bad-passphrase").html("Passphrase is too short.").css('display', 'inline');
    }
    else if(values.password1 !== values.password2) {
      $("#bad-passphrase").html("Passphrase mismatch").css('display', 'inline');
    }
    else props.createAccount(values);
  }

  return (
    <>
    <Title/>
    <h2>Create account:</h2>
    <form>
      <label htmlFor="loginName">
        Login name:<br/><input id="loginName" name="loginName" onChange={handleChange} 
        value={values.loginName || ""} type="text" minLength="1" maxLength="24" size="30" required autoFocus/>
      </label><br/>
      <label htmlFor="displayName">
        Display name:<br/><input id="displayName" name="displayName" onChange={handleChange} 
        value={values.displayName || ""} type="text" minLength="1" maxLength="24" size="30" required/>
      </label><br/>
      <label htmlFor="emailAddress"> 
        Email address:<br/><input id="emailAddress" name="emailAddress" onChange={handleChange} 
        value={values.emailAddress || ""}type="email" minLength="1" maxLength="128" size="30" placeholder="Optional - for account recovery"/>
      </label><br/>
      <label htmlFor="password1">
        Passphrase:   <span style={{opacity: "90%"}}>8+ characters</span><br/><input id="password1" name="password1" onChange={handleChange} 
        value={values.password1 || ""} type="password" minLength="8" maxLength="50" size="30" required/>
      </label><br/>
      <label htmlFor="password2">
        Verify passphrase:<br/><input id="password2" name="password2" onChange={handleChange} onKeyPress={event => {if (event.key === 'Enter') handleSubmit()}}
        value={values.password2 || ""} type="password" minLength="8" maxLength="50" size="30" required/>
      </label><br/>
      <p id="bad-passphrase"></p><br/>
      <button className="main-button" type="button" onClick={handleSubmit}>Create account</button><br/><br/>
    </form>
    or...<br/><br/>
    <button className="main-button" type="button" onClick={() => props.goToPage("Login")}>I already have an account.</button>
    </>
  )
}

const mapDispatchToProps = {
  createAccount,
  goToPage
}

CreateAccount.propTypes = {
  createAccount: PropTypes.func.isRequired,
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(CreateAccount);