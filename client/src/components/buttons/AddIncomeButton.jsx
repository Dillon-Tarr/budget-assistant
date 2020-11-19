import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { addIncome } from '../../actions/budgetActions';

function AddIncomeButton(props) {
  const budget = useSelector(state => state.budget);
  const { values, handleChange } = useInputTracking();
  const handleAdd = () => {
    props.createBudget(values);
  }
  const { hideState, hideOrUnhide, unhide } = useHideOrUnhide({
    addIncome: true,
    isRecurring: true
  });
  
  return (<>
    <button className="main-button" onClick={() => hideOrUnhide("addIncome")}>Add income</button><br/>
    {hideState.addIncome && (
    <div name="addIncome" className="add-income-or-outgo">
      <label htmlFor="incomeName">
        Enter a name for the income:<br/>e.g. My paycheck<br/><input id="incomeName" onChange={handleChange} name="incomeName"
        value={values.incomeName || "My paycheck"} type="text" minLength="1" maxLength="32" size="30" required autoFocus/>
      </label>
      <label htmlFor="dollarsPerOccurrence">
        How many dollars per occurrence?<br/>$<input id="dollarsPerOccurrence" onChange={handleChange} name="dollarsPerOccurrence"
        value={values.dollarsPerOccurrence || ""} type="number" min="1" max="1000000000" step="1" required/>
      </label><br/>
      <label htmlFor="isRecurring">Is this income recurring?<br/>
        <select name="isRecurring" id="isRecurring" onChange={handleChange} defaultValue="false">
          <option value="false">No, it just happens once.</option>
          <option value="true">Yes, it happens multiple times.</option>
        </select>
      </label><br/>
      {values.isRecurring === "true" && (
      <label htmlFor="recurringType">What kind of pattern does it follow?<br/>
      A <i>normal</i> pattern like "Every Monday and Friday", "Once a  year", or "The 1st and 15th of every month"<br/>
      <u>or</u> a <i>weird</i> pattern like "On the last Sunday of every month"?<br/>
        <select name="recurringType" id="recurringType" onChange={handleChange} defaultValue="normal">
          <option value="normal">normal</option>
          <option value="weird">weird</option>
        </select>
      </label>
      )}
      <br/><button className="main-button" /*onClick={() => handleAdd()}*/>Add</button>
    </div>)}
  </>)
}

const mapDispatchToProps = {
  addIncome
}

AddIncomeButton.propTypes = {
  addIncome: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(AddIncomeButton);