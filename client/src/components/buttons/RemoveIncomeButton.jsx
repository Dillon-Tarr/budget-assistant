/* eslint-disable no-mixed-operators */
import { React } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { removeIncome } from '../../actions/budgetActions';

function RemoveIncomeButton(props) {
  const { hideState, hideOrUnhide, hide } = useHideOrUnhide({
    reallyRemoveIncome: true
  });
  const handleRemove = () => {
    props.removeIncome(props.budgetId, props.incomeId);
    hide("reallyRemoveIncome");
  }
  return (<>
    <button className="main-button" onClick={() => hideOrUnhide("reallyRemoveIncome")}>Remove</button><br/>
    {!hideState.reallyRemoveIncome &&
    <div name="reallyRemoveIncome">
      <p>Are you sure?</p>
      <button className="main-button remove-button" onClick={() => handleRemove()}>Yes, remove</button><br/>
      <button className="main-button" onClick={() => hide("reallyRemoveIncome")}>No, keep it</button>
    </div>}
  </>)
}

const mapDispatchToProps = {
  removeIncome
}

RemoveIncomeButton.propTypes = {
  removeIncome: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(RemoveIncomeButton);