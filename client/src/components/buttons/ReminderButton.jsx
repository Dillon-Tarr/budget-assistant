import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import $ from 'jquery'

import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { muteReminder, stopReminding } from '../../actions/budgetActions';

function ReminderButton(props) {
  const text = props.text;
  const budgetId = props.budgetId;
  const outgoId = props.outgoId;
  const nextOccurrence = props.nextOccurrence;
  const reminderIndex = props.reminderIndex;
  const { hideState, hideOrUnhide } = useHideOrUnhide({
    reminderOptions: true
  });

  return (<>
      <button className="reminder main-button" onClick={() => {hideOrUnhide("reminderOptions")}}>{text}</button>
      {!hideState.reminderOptions && (
      <div name="reminderOptions" className="reminderOptions">
        <button className="main-button" onClick={() => props.muteReminder(budgetId, outgoId, nextOccurrence, reminderIndex)}>Mute occurrence</button>
        <button className="main-button" onClick={() => props.stopReminding(budgetId, outgoId, reminderIndex)}>Stop reminding</button>
      </div>)}
    </>)
}

const mapDispatchToProps = {
  muteReminder,
  stopReminding
}

ReminderButton.propTypes = {
  muteReminder: PropTypes.func.isRequired,
  stopReminding: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ReminderButton);