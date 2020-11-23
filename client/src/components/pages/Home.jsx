import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { goToPage } from '../../actions/viewActions';
import { createBudget } from '../../actions/budgetActions';
import ReminderButton from '../buttons/ReminderButton';

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
    const reminders = [<span key="reminderInstructions" style={{fontSize: ".7rem"}}>Select a reminder to mute until the next occurrence or to stop all reminders for that outgo.<br/></span>];
    for (let i = 0; i < userDetails.outgoReminders.length; i++){
      reminders.push(<span key={`reminder${i}`}>
        <ReminderButton
          text={userDetails.outgoReminders[i].text}
          budgetId={userDetails.outgoReminders[i].budgetId}
          outgoId={userDetails.outgoReminders[i].outgoId}
          nextOccurrence={userDetails.outgoReminders[i].nextOccurrence}
          reminderIndex={i}
        /><br/>
      </span>);
    }
    if (reminders.length === 1) return <p>None right now.</p>
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
        value={values.budgetName || ""} type="text" minLength="1" maxLength="32" size="30" required autoFocus
        onKeyPress={event => {if (event.key === 'Enter') handleSubmit()}}/>
        </label>
        <button className="main-button" onClick={handleSubmit}>Create</button>
        <p className="invalid-input"></p><br/>
      </div>)}
      <button className="main-button" onClick={() => props.goToPage("Learn")}>Learning about budgeting</button>
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
        <p>Outgo reminders:<br/></p>
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