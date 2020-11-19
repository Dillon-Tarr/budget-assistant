import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import AddIncomeButton from './buttons/AddIncomeButton';

import { getOccurrenceString } from '../helpers/string-generators';

import { goToPage } from '../actions/viewActions';

function Income(props) {
  const budget = useSelector(state => state.budget);

  const renderIncome = () => {
    if (budget.income.length === 0) return (<>
      <p>None yet.</p>
      <AddIncomeButton/>
      </>)
    const income = [];
    for (let i = 0; i < budget.income.length; i++) {
      const occurrenceString = getOccurrenceString(budget.income[i]);
      let startDate = new Date(budget.income[i].startDate);
      startDate = startDate.toDateString();
      if (budget.income[i].isRecurring) {
        var inclusiveEndDate = new Date(budget.income[i].inclusiveEndDate);
        inclusiveEndDate = inclusiveEndDate.toDateString();
      }
      income.push(
        <p className="income-or-outgo" key={budget.income[i]._id}>
          <u>{budget.income[i].name}</u><br/>
          {occurrenceString}<br/>
          {budget.income[i].isRecurring && (<>starting </>)}
          {!budget.income[i].isRecurring && (<>on </>)}
          {startDate}
          {budget.income[i].isRecurring && (<>,<br/>
          ending {inclusiveEndDate}</>)}</p>
      )
    }
    return income;
  }
  
  return (
    <div id="all-income">
      <h3>Budgeted income:</h3>
      <div>
        {renderIncome()}
        <AddIncomeButton/>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  goToPage
}

Income.propTypes = {
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Income);