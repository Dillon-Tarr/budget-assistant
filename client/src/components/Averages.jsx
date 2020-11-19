import React from 'react';
import { connect, useSelector } from 'react-redux';

import { calculateYearlyIncomeOrOutgo } from '../helpers/calculators'

function Averages() {
  const budget = useSelector(state => state.budget);
  const yearlyIncome = calculateYearlyIncomeOrOutgo(budget.income);
  const yearlyOutgo = calculateYearlyIncomeOrOutgo(budget.outgo);
  const yearlyNetIncrease = yearlyIncome - yearlyOutgo;
  let positiveOrNegative = "positive";
  if (yearlyNetIncrease === 0) positiveOrNegative = "zero";
  if (yearlyNetIncrease < 0) positiveOrNegative = "negative";

  return (
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
  )
}

export default connect()(Averages);