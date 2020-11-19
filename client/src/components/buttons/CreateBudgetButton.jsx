import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { createBudget } from '../../actions/budgetActions';

function CreateBudgetButton(props) {
  const userDetails = useSelector(state => state.userDetails);
  const { values, handleChange } = useInputTracking();
  const handleSubmit = () => {
    if (!values.budgetName) $(".invalid-input").html("<br/>You must enter a name for your budget.").css('display', 'inline');
    else props.createBudget(values.budgetName);
  }
  const { hideState, hideOrUnhide } = useHideOrUnhide({
    enterBudgetName: true
  });

  return (<>
    <button className="main-button" onClick={() => hideOrUnhide("enterBudgetName")}>Create a budget</button><br/>
    {!hideState.enterBudgetName && (
    <div name="enterBudgetName">
      <label htmlFor="budgetName">
      Enter a name for your budget:<br/>e.g. {userDetails.displayName}'s Budget<br/><input id="budgetName" onChange={handleChange} name="budgetName"
      value={values.budgetName || ""} type="text" minLength="1" maxLength="32" size="30" required autoFocus/>
      </label>
      <button className="main-button" onClick={handleSubmit}>Create</button>
      <p className="invalid-input"></p><br/>
    </div>)}
    </>)
}

const mapDispatchToProps = {
  createBudget
}

CreateBudgetButton.propTypes = {
  createBudget: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(CreateBudgetButton);