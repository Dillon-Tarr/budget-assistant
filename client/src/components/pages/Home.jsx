import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { openMenu, closeMenu } from '../../actions/viewActions';

import MenuToggle from '../MenuToggle';
import Menu from '../Menu';
import Welcome from '../Welcome';

function Home(props) {

  return (
    <>
      <Menu/>
      <main>
        <MenuToggle/>
        <Welcome displayName={props.displayName}/>
        
        
        
        
      </main>
    </>
  )
}

const mapStateToProps = state => {
  return {
    displayName: state.userDetails.displayName
  }
}

const mapDispatchToProps = {
  openMenu,
  closeMenu
}

Home.propTypes = {
  openMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);