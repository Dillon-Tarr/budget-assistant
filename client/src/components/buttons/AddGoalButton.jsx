import { React, useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { addGoal } from '../../actions/goalActions';

function AddGoalButton(props) {
  const { hideState, hideOrUnhide, hide } = useHideOrUnhide({
    addGoalForm: true
  });
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState(new Date(Date.now() + 31536000000));
  const { values, handleChange, resetInputTracking } = useInputTracking();
  const handleAdd = () => {
    if (values.includeEstimatedCompletionDate === "true") props.addGoal(values.goalText, estimatedCompletionDate);
    else props.addGoal(values.goalText);
    hide("addGoalForm");
    resetInputTracking();
  }
  return (<>
    <button className="main-button" onClick={() => hideOrUnhide("addGoalForm")}>Add goal</button><br/>
    {!hideState.addGoalForm && (
    <div className="form-container">
    <div name="addGoalForm">
      <label htmlFor="goalText">
        What is the goal?<br/><input id="goalText" onChange={handleChange} name="goalText"
        value={values.goalText || ""} type="text" minLength="1" maxLength="120" size="26" required autoFocus/>
      </label><br/>
      <label htmlFor="includeEstimatedCompletionDate">Add an estimated completion date?<br/>
        <select name="includeEstimatedCompletionDate" id="includeEstimatedCompletionDate" onChange={handleChange} defaultValue="false">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </label><br/>
      {values.goalText && values.goalText.length >= 1 && values.goalText.length <= 120 && values.includeEstimatedCompletionDate === "true" && (<>
        Estimated completion date:
        <DatePicker selected={estimatedCompletionDate}
        onChange={date => setEstimatedCompletionDate(date)}
        minDate={new Date()}
        maxDate={new Date(Date.now() + 1262304000000)}
        showDisabledMonthNavigation
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"/><br/>
        </>)}
      {values.goalText && values.goalText.length >= 1 && values.goalText.length <= 120 && <button className="main-button" onClick={() => handleAdd()}>Add</button>}
      <br/><br/><br/><br/>
    </div>
    </div>
  )}
  </>)
}

const mapDispatchToProps = {
  addGoal
}

AddGoalButton.propTypes = {
  addGoal: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(AddGoalButton);