/* eslint-disable no-mixed-operators */
import { React } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { removeOutgo } from '../../actions/budgetActions';

function RemoveOutgoButton(props) {
  const { hideState, hideOrUnhide, hide } = useHideOrUnhide({
    reallyRemoveOutgo: true
  });
  const handleRemove = () => {
    props.removeOutgo(props.budgetId, props.outgoId);
    hide("reallyRemoveOutgo");
  }
  return (<>
    <button className="main-button" onClick={() => hideOrUnhide("reallyRemoveOutgo")}>Remove</button><br/>
    {!hideState.reallyRemoveOutgo &&
    <div name="reallyRemoveOutgo">
      <p>Are you sure?</p>
      <button className="main-button remove-button" onClick={() => handleRemove()}>Yes, remove</button><br/>
      <button className="main-button" onClick={() => hide("reallyRemoveOutgo")}>No, keep it</button>
    </div>}
  </>)
}

const mapDispatchToProps = {
  removeOutgo
}

RemoveOutgoButton.propTypes = {
  removeOutgo: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(RemoveOutgoButton);