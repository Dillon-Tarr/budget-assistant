import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { openMenu, closeMenu } from '../actions/viewActions';

import Welcome from './Welcome';
import MenuToggle from './MenuToggle';

function Header(props) {
  const userDetails = useSelector(state => state.userDetails);

  return (
    <>
      <header>
        <Welcome displayName={userDetails.displayName}/>
        <MenuToggle/>
      </header>
      <hr/>
    </>
  )
} 

const mapDispatchToProps = {
  openMenu,
  closeMenu
}

Header.propTypes = {
  openMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Header);