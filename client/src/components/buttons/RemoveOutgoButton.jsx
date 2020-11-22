import { React } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { removeOutgo } from '../../actions/budgetActions';

function RemoveOutgoButton(props) {
  // eslint-disable-next-line
  const { hideState, hideOrUnhide, hide, unhide } = useHideOrUnhide({
    reallyRemoveOutgo: true,
    removeOutgoButton: false
  });
  const handleRemove = () => {
    props.removeOutgo(props.budgetId, props.outgoId);
    hide("reallyRemoveOutgo");
  }
  return (<>
    {!hideState.removeOutgoButton && (<><button className="main-button" name="removeOutgoButton" onClick={() => {
      unhide("reallyRemoveOutgo");
      hide("removeOutgoButton");
      }}>Remove</button><br/></>)}
    {!hideState.reallyRemoveOutgo &&
    <div name="reallyRemoveOutgo">
      <p className="are-you-sure">Are you sure?</p>
      <button className="main-button remove-button" onClick={() => handleRemove()}>Yes, remove</button><br/>
      <button className="main-button" onClick={() => {
        hide("reallyRemoveOutgo");
        unhide("removeOutgoButton");
      }}>No, keep it</button>
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