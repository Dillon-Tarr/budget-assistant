import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import CreateBudgetButton from '../buttons/CreateBudgetButton';

import { goToPage } from '../../actions/viewActions';
import { openBudget } from '../../actions/budgetActions';

function Budgets(props) {
  const userDetails = useSelector(state => state.userDetails);

  const renderBudgetButtons = () => {
    const budgets = [];
    for (let i = 0; i < userDetails.managedBudgets.length; i++){
      budgets.push(<span key={`${userDetails.managedBudgets[i]._id}`}>
        <button className="main-button" onClick={() => props.openBudget(`${userDetails.managedBudgets[i]._id}`)}>
          {userDetails.managedBudgets[i].name}
        </button><br/></span>);
    }
    return budgets;
  }

  return (userDetails.managedBudgets.length/* + userDetails.viewedBudgets.length*/ < 1) ?
    (<>
    <div className="budgets">
      <h3>Your budgets:</h3>
      <p>You don't have any budgets yet.<br/>What would you like to do?</p>
      <CreateBudgetButton/>
      <button className="main-button" onClick={() => props.goToPage("Learn")}>Learn about budgeting</button>
    </div>
    </>) : (<>
    <div className="budgets">
    <CreateBudgetButton/>
    <h3>Your budgets:</h3>
      {renderBudgetButtons()}
    </div>
    </>)
}

const mapDispatchToProps = {
  goToPage,
  openBudget
}

Budgets.propTypes = {
  goToPage: PropTypes.func.isRequired,
  openBudget: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Budgets);