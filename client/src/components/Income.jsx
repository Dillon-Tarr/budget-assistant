import React from 'react';
import { connect, useSelector } from 'react-redux';
import AddIncomeButton from './buttons/AddIncomeButton';

import { getOccurrenceString } from '../helpers/string-generators';
import RemoveIncomeButton from './buttons/RemoveIncomeButton';

function Income(props) {
  const budget = useSelector(state => state.budget);

  const renderIncome = () => {
    if (budget.income.length === 0) return <p>None yet.</p>;
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
        <div className="income-or-outgo" key={budget.income[i]._id}>
          <p>
          <u>{budget.income[i].name}</u><br/>
          {occurrenceString}<br/>
          {budget.income[i].isRecurring && (<>starting </>)}
          {!budget.income[i].isRecurring && (<>on </>)}
          {startDate}
          {budget.income[i].isRecurring && (<>,<br/>
          ending {inclusiveEndDate}</>)}</p>
          <div className="income-or-outgo-buttons">
            <button className="main-button" /*onClick={() => modifyIncome(budget.income[i]._id)}*/>Modify</button><br/>
            <RemoveIncomeButton budgetId={budget._id} incomeId={budget.income[i]._id}/>
          </div>
        </div>
      )
    }
    return income;
  }
  
  return (
    <div id="all-income">
      <h3>Budgeted income:</h3>
      <div>
        {renderIncome()}
        <AddIncomeButton budgetId={budget._id}/>
      </div>
    </div>
  )
}


export default connect()(Income);