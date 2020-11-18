import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { calculateYearlyIncomeOrOutgo } from '../../helpers/calculators'

import { goToPage } from '../../actions/viewActions';

function Budget(props) {
  const budget = useSelector(state => state.budget);
  const yearlyIncome = calculateYearlyIncomeOrOutgo(budget.income);
  const yearlyOutgo = calculateYearlyIncomeOrOutgo(budget.outgo);
  const yearlyNetIncrease = yearlyIncome - yearlyOutgo;
  let positiveOrNegative = "positive";
  if (yearlyNetIncrease === 0) positiveOrNegative = "zero"; 
  if (yearlyNetIncrease < 0) positiveOrNegative = "negative"; 

  return (budget.income.length === 0 && budget.outgo.length === 0) ? ( 
    <div className="budget">
      <div className="budget-options">
        <button className="main-button" onClick={() => props.goToPage("ModifyBudget")}>Add income/outgo</button><br/>
      </div>
    </div>
    ) : (
    <div className="budget">
      <div className="averages-container">
        <div className="averages">
          <p id="daily-averages">
            Daily average...<br/>
            income: <span className="positive">{(yearlyIncome/365).toFixed(2)}</span><br/>
            outgo: {(yearlyOutgo/365).toFixed(2)}<br/>
            net increase: <span className={positiveOrNegative}>{(yearlyNetIncrease/365).toFixed(2)}</span>
          </p>
          <p id="monthly-averages">
            Monthly average...<br/>
            income: <span className="positive">{(yearlyIncome/12).toFixed(2)}</span><br/>
            outgo: {(yearlyOutgo/12).toFixed(2)}<br/>
            net increase: <span className={positiveOrNegative}>{(yearlyNetIncrease/12).toFixed(2)}</span>
          </p>
        </div>
        <div className="averages">
          <p id="weekly-averages">
            Weekly average...<br/>
            income: <span className="positive">{(yearlyIncome/365*7).toFixed(2)}</span><br/>
            outgo: {(yearlyOutgo/365*7).toFixed(2)}<br/>
            net increase: <span className={positiveOrNegative}>{(yearlyNetIncrease/365*7).toFixed(2)}</span>
          </p>
          <p id="yearly-averages">
            Yearly average...<br/>
            income: <span className="positive">{yearlyIncome.toFixed(2)}</span><br/>
            outgo: {yearlyOutgo.toFixed(2)}<br/>
            net increase: <span className={positiveOrNegative}>{yearlyNetIncrease.toFixed(2)}</span>
          </p>
        </div>
      </div>
      <br/>
      <div className="budget-options">
        <button className="main-button" onClick={() => props.goToPage("ModifyBudget")}>Modify budgeted income/outgo</button><br/>
        {budget.outgo.length === 0 && (<><button className="main-button" onClick={() => props.goToPage("OutgoBreakdown")}>Outgo breakdown by category</button><br/></>)}
        <button className="main-button" onClick={() => props.goToPage("FutureValueCalculator")}>Future value calculator</button>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  goToPage
}

Budget.propTypes = {
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Budget);