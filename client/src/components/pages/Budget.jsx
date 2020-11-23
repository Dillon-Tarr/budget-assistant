import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { goToPage } from '../../actions/viewActions';
import Averages from '../Averages';
import OutgoBreakdownButton from '../buttons/OutgoBreakdownButton';

function Budget(props) {
  const budget = useSelector(state => state.budget);

  return (budget.income.length === 0 && budget.outgo.length === 0) ? (
    <div className="budget">
      <div className="budget-options">
        <button className="main-button" onClick={() => props.goToPage("IncomeAndOutgo")}>Add income and outgo</button><br/>
      </div>
    </div>
    ) : (
    <div className="budget">
      <Averages/>
      <br/>
      <div className="budget-options">
        {budget.outgo.length > 0 && <OutgoBreakdownButton outgo={budget.outgo}/>}
        <button className="main-button" onClick={() => props.goToPage("FutureValueCalculator")}>Future value calculator</button><br/>
        <button className="main-button" onClick={() => props.goToPage("IncomeAndOutgo")}>View/modify budgeted income/outgo</button><br/><br/>
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