import { React, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, connect } from 'react-redux';

import { logOut } from '../actions/accountActions';
import { goToPage, openMenu, closeMenu } from '../actions/viewActions';

function Menu(props) {
  const menuIsOpen = useSelector(state => state.view.menuIsOpen);
  
  const menuRef = useRef();

  useEffect(() => {
    const handler = event => {
      if (menuIsOpen && !menuRef.current.contains(event.target)) props.closeMenu();
    }
    document.addEventListener("pointerdown", handler);
    return () => {
      document.removeEventListener("pointerdown", handler);
    };
  });

  return (
    <div className="menu-container">
      <nav className="menu" ref={menuRef}>
        <div className="menu-close-container"><button className="menu-close" onClick={props.closeMenu}>✕</button></div>
        <button className="home menu-button" onClick={() => props.goToPage("Home")}>Home</button>
        <button className="home menu-button" onClick={() => props.goToPage("Budgets")}>Budgets</button>
        <button className="home menu-button" onClick={() => props.goToPage("Goals")}>Goals</button>
        <button className="home menu-button" onClick={() => props.goToPage("Learn")}>Learn</button>
        <button type="button" className="menu-button" onClick={() => props.logOut()}>Log out</button>
      </nav>
    </div>
  )
}

const mapDispatchToProps = {
  logOut,
  goToPage,
  openMenu,
  closeMenu
}

Menu.propTypes = {
  logOut: PropTypes.func.isRequired,
  goToPage: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Menu);