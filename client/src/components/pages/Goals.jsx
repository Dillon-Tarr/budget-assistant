import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { goToPage } from '../../actions/viewActions';
import AddGoalButton from '../buttons/AddGoalButton';
import RemoveGoalButton from '../buttons/RemoveGoalButton';

function Goals(props) {
  const userDetails = useSelector(state => state.userDetails);

  const renderGoals = () => {
    if (userDetails.goals.length === 0) return <p>None yet.</p>;
    const goals = [];
    for (let i = 0; i < userDetails.goals.length; i++) {
      goals.push(
        <div className="goal" key={userDetails.goals[i]._id}>
          <p><u>{userDetails.goals[i].text}</u><br/>
          {userDetails.goals[i].isComplete && !userDetails.goals[i].completedDate && (<i>Complete</i>)}
          {userDetails.goals[i].isComplete && userDetails.goals[i].completedDate && (<><i>Completed</i> {new Date(userDetails.goals[i].completedDate).toDateString()}</>)}
          {!userDetails.goals[i].isComplete && userDetails.goals[i].estimatedCompletionDate && (<><i>Estimated completion date:</i> {new Date(userDetails.goals[i].estimatedCompletionDate).toDateString()}</>)}
          {!userDetails.goals[i].isComplete && !userDetails.goals[i].estimatedCompletionDate && (<i>Incomplete</i>)}
          </p>
          <div className="goal-buttons">
            <RemoveGoalButton goalId={userDetails.goals[i]._id}/>
          </div>
        </div>
      )
    }
    return goals;
  }
  return (
    <div className="goals">
      <h3>Goals:</h3>
      {renderGoals()}<br/>
      <AddGoalButton/><br/>
    </div>
    )
}

const mapDispatchToProps = {
  goToPage
}

Goals.propTypes = {
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Goals);