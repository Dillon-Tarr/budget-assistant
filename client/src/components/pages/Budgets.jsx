import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { goToPage } from '../../actions/viewActions';
import { openBudget } from '../../actions/budgetActions';

import Header from '../Header';

function Budgets(props) {
  const userDetails = useSelector(state => state.userDetails);
  const renderBudgetButtons = () => {
    const budgets = [];
    for (let i = 0; i < userDetails.managedBudgets.length; i++){
      budgets.push(
        <button className="main-button" key={`${userDetails.managedBudgets[i]._id}`} onClick={() => props.openBudget(`${userDetails.managedBudgets[i]._id}`)}>
          {userDetails.managedBudgets[i].name}
        </button>
        );
    }
    return budgets;
  }

  if (userDetails.managedBudgets.length/* + userDetails.viewedBudgets.length*/ < 1) {
    return (
      <>
        <div className="budgets">
          <h3>Your budgets:</h3>
          <p>You don't have any budgets yet. What would you like to do?</p>
          <button className="main-button" onClick={() => props.goToPage("CreateBudget")}>Create a budget</button><br/>
          <button className="main-button" onClick={() => props.goToPage("Learn")}>Learn about budgeting</button>
        </div>
      </>
    )
  }
else return (
    <>
        <div className="budgets">
        <h3>Your budgets:</h3>
          {renderBudgetButtons()}
        </div>
    </>
  )
  
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