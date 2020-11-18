import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { goToPage } from '../../actions/viewActions';
import { createBudget } from '../../actions/budgetActions';

function Home(props) {
  const userDetails = useSelector(state => state.userDetails);
  const { values, handleChange } = useInputTracking();
  const handleSubmit = () => {
    if (!values.budgetName) $(".invalid-input").html("<br/>You must enter a name for your budget.").css('display', 'inline');
    else props.createBudget(values.budgetName);
  }
  const { hideState, hideOrUnhide } = useHideOrUnhide({
    enterBudgetName: true
  });
  const renderReminders = () => {
    const reminders = [];
    for (let i = 0; i < userDetails.outgoReminders.length; i++){
      reminders.push(
        <p className="reminder" key={`reminder${i}`}>
          {userDetails.outgoReminders[i]}
        </p>
        );
    }
    if (reminders.length === 0) return <p>None right now.</p>
    return reminders;
  }

  return (userDetails.managedBudgets.length/* + userDetails.viewedBudgets.length*/ < 1) ? (<>
    <div className="home">
      <p>Get started by...</p>
      <button className="main-button" onClick={() => hideOrUnhide("enterBudgetName")}>Creating a budget</button><br/>
      {!hideState.enterBudgetName && (
      <div name="enterBudgetName">
        <label htmlFor="budgetName">
        Enter a name for your budget.<br/>e.g. {userDetails.displayName}'s Budget<br/><input id="budgetName" onChange={handleChange} name="budgetName"
        value={values.budgetName || ""} type="text" minLength="1" maxLength="32" size="30" required autoFocus/>
        </label>
        <button className="main-button" onClick={handleSubmit}>Create</button>
        <p className="invalid-input"></p><br/>
      </div>)}
      <button className="main-button">Learning about budgeting</button>
    </div>
    </>) : (<>
    <div className="home">
      <div>
        <p>What's next?</p>
        <button className="main-button" onClick={() => props.goToPage("Budgets")}>Budgets</button><br/>
        <button className="main-button" onClick={() => props.goToPage("Goals")}>Goals</button><br/>
        <button className="main-button" onClick={() => props.goToPage("Learn")}>Learn</button>
      </div>
      <div className="reminders">
        <p>Outgo reminders:</p>
        {renderReminders()}
      </div>
    </div>
    </>)
}

const mapDispatchToProps = {
  goToPage,
  createBudget
}

Home.propTypes = {
  goToPage: PropTypes.func.isRequired,
  createBudget: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Home);