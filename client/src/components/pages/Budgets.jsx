import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { goToPage } from '../../actions/viewActions';
import { createBudget, openBudget } from '../../actions/budgetActions';

function Budgets(props) {
  const userDetails = useSelector(state => state.userDetails);
  const { values, handleChange } = useInputTracking();
  const handleSubmit = () => {
    if (!values.budgetName) $(".invalid-input").html("<br/>You must enter a name for your budget.").css('display', 'inline');
    else props.createBudget(values.budgetName);
  }
  const { hideState, hideOrUnhide } = useHideOrUnhide({
    enterBudgetName: true
  });
  const renderCreateBudgetButton = () => {
    return (<>
      <button className="main-button" onClick={() => hideOrUnhide("enterBudgetName")}>Create a budget</button><br/>
      {!hideState.enterBudgetName && (
      <div name="enterBudgetName">
        <label htmlFor="budgetName">
        Enter a name for your budget.<br/>e.g. {userDetails.displayName}'s Budget<br/><input id="budgetName" onChange={handleChange} name="budgetName"
        value={values.budgetName || ""} type="text" minLength="1" maxLength="32" size="30" required autoFocus/>
        </label>
        <button className="main-button" onClick={handleSubmit}>Create</button>
        <p className="invalid-input"></p><br/>
      </div>)}
      </>)
  }
  const renderBudgetButtons = () => {
    const budgets = [];
    for (let i = 0; i < userDetails.managedBudgets.length; i++){
      budgets.push(<>
        <button className="main-button" key={`${userDetails.managedBudgets[i]._id}`} onClick={() => props.openBudget(`${userDetails.managedBudgets[i]._id}`)}>
          {userDetails.managedBudgets[i].name}
        </button><br/></>);
    }
    return budgets;
  }

  return (userDetails.managedBudgets.length/* + userDetails.viewedBudgets.length*/ < 1) ?
    (<>
    <div className="budgets">
      <h3>Your budgets:</h3>
      <p>You don't have any budgets yet.<br/>What would you like to do?</p>
      {renderCreateBudgetButton()}
      <button className="main-button" onClick={() => props.goToPage("Learn")}>Learn about budgeting</button>
    </div>
    </>) : (<>
    <div className="budgets">
    {renderCreateBudgetButton()}
    <h3>Your budgets:</h3>
      {renderBudgetButtons()}
    </div>
    </>)
}

const mapDispatchToProps = {
  goToPage,
  createBudget,
  openBudget
}

Budgets.propTypes = {
  goToPage: PropTypes.func.isRequired,
  createBudget: PropTypes.func.isRequired,
  openBudget: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Budgets);