/* eslint-disable no-mixed-operators */
import { React, useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
import $ from 'jquery'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { modifyGoal } from '../../actions/goalActions';

function ModifyGoalButton(props) {
  const { hideState, hideOrUnhide, hide } = useHideOrUnhide({
    modifyGoalForm: true,
    estimatedCompletionDatePicker: false
  });
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState((props.goal.IsComplete && props.goal.estimatedCompletionDate && new Date(props.goal.estimatedCompletionDate)) || new Date(Date.now()));
  const [completedDate, setCompletedDate] = useState((props.goal.isComplete && new Date(props.goal.completedDate)) || new Date());
  const { values, handleChange, resetInputTracking } = useInputTracking();
  const handleModify = () => {
    const allValues = {...values};
    allValues.estimatedCompletionDate = estimatedCompletionDate;
    allValues.completedDate = completedDate;
    allValues.notSure = $("#notSure").prop("checked");
    props.modifyGoal(props.goal, allValues);
    hide("modifyGoalForm");
    resetInputTracking();  
  }
    
  return (<>
  <button className="main-button" onClick={() => hideOrUnhide("modifyGoalForm")}>{hideState.modifyGoalForm ? (<>Edit</>) : (<>Cancel editing</>)}</button><br/>
    {!hideState.modifyGoalForm && (
    <div className="modify-goal">
    <div className="form-container">
    <div name="modifyGoalForm" className="modify-goal-form">
      <label htmlFor="goalText">
        What is the goal?<br/><input id="goalText" onChange={handleChange} name="goalText"
        value={values.goalText || props.goal.text} type="text" minLength="1" maxLength="120" size="26"/>
      </label><br/>
      <label htmlFor="isComplete">Is it complete?&nbsp;&nbsp;
        <select name="isComplete" id="isComplete" onChange={handleChange} defaultValue={props.goal.isComplete.toString()}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </label><br/>
      {((props.goal.isComplete && values.isComplete !== "false") || (!props.goal.isComplete && values.isComplete === "true")) ? (<>
      When was it completed?
      <DatePicker selected={completedDate}
      onChange={date => setCompletedDate(date)}
      minDate={new Date(Date.now() - 2524608000000)}
      maxDate={new Date()}
      showDisabledMonthNavigation
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"/><br/>
      </>): (<>
      When do you expect to complete it?
      <span name="estimatedCompletionDatePicker">
      <DatePicker selected={estimatedCompletionDate}
      onChange={date => setEstimatedCompletionDate(date)}
      minDate={new Date()}
      maxDate={new Date(Date.now() + 2524608000000)}
      showDisabledMonthNavigation
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"/><br/>
      </span>
      <label htmlFor="notSure"><input name="notSure" id="notSure" type="checkbox" value="notSure" className="big-checkbox"/> Not sure</label><br/>
      </>)}
      <button className="main-button" onClick={() => handleModify()}>Submit changes</button>
    </div>
    </div>
    </div>
    )}
    
  </>)
}

const mapDispatchToProps = {
  modifyGoal
}

ModifyGoalButton.propTypes = {
  modifyGoal: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ModifyGoalButton);