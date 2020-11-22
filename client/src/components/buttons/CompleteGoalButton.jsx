import { React } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { completeGoal } from '../../actions/goalActions';

function CompleteGoalButton(props) {
  return <button className="main-button complete-goal-button" onClick={() => {props.completeGoal(props.goalId, props.isComplete)}}>Mark {props.isComplete === true && (<>in</>)}complete</button>
}

const mapDispatchToProps = {
  completeGoal
}

CompleteGoalButton.propTypes = {
  completeGoal: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(CompleteGoalButton);