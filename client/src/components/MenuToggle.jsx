import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, connect } from 'react-redux';

import { openMenu } from '../actions/viewActions';

function MenuToggle(props) {
  const menuIsOpen = useSelector(state => state.view.menuIsOpen);

  return (
    <>
      <div className="menu-toggle-container">
        <button className="menu-toggle" onClick={() => {
            if (!menuIsOpen) props.openMenu();
          }}>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
        </button>
      </div>
    </>
  )
}

const mapDispatchToProps = {
  openMenu
}

MenuToggle.propTypes = {
  openMenu: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(MenuToggle);