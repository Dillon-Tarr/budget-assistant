import { React } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { removeGoal } from '../../actions/goalActions';

function RemoveGoalButton(props) {
  // eslint-disable-next-line
  const { hideState, hideOrUnhide, hide, unhide } = useHideOrUnhide({
    reallyRemoveGoal: true,
    removeGoalButton: false
  });
  const handleRemove = () => {
    props.removeGoal(props.goalId);
    hide("reallyRemoveGoal");
  }
  return (<>
    {!hideState.removeGoalButton && (<><button className="main-button" name="removeGoalButton" onClick={() => {
      unhide("reallyRemoveGoal");
      hide("removeGoalButton");
      }}>Remove</button><br/></>)}
    {!hideState.reallyRemoveGoal &&
    <div name="reallyRemoveGoal">
      <p className="are-you-sure">Are you sure?</p>
      <button className="main-button remove-button" onClick={() => handleRemove()}>Yes, remove</button><br/>
      <button className="main-button" onClick={() => {
        hide("reallyRemoveGoal");
        unhide("removeGoalButton");
      }}>No, keep it</button>
    </div>}
  </>)
}

const mapDispatchToProps = {
  removeGoal
}

RemoveGoalButton.propTypes = {
  removeGoal: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(RemoveGoalButton);