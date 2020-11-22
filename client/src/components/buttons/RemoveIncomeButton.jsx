import { React } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { removeIncome } from '../../actions/budgetActions';

function RemoveIncomeButton(props) {
  // eslint-disable-next-line
  const { hideState, hideOrUnhide, hide, unhide } = useHideOrUnhide({
    reallyRemoveIncome: true,
    removeIncomeButton: false
  });
  const handleRemove = () => {
    props.removeIncome(props.budgetId, props.incomeId);
    hide("reallyRemoveIncome");
  }
  return (<>
    {!hideState.removeIncomeButton && (<><button className="main-button" name="removeIncomeButton" onClick={() => {
      unhide("reallyRemoveIncome");
      hide("removeIncomeButton");
      }}>Remove</button><br/></>)}
    {!hideState.reallyRemoveIncome &&
    <div name="reallyRemoveIncome">
      <p className="are-you-sure">Are you sure?</p>
      <button className="main-button remove-button" onClick={() => handleRemove()}>Yes, remove</button><br/>
      <button className="main-button" onClick={() => {
        hide("reallyRemoveIncome");
        unhide("removeIncomeButton");
      }}>No, keep it</button>
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