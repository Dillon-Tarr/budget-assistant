import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { generateWelcomeMessage } from '../helpers/string-generators';
import { goToPage } from '../actions/viewActions';

import MenuToggle from './MenuToggle';

function Header(props) {
  const page = useSelector(state => state.view.page);
  const userDetails = useSelector(state => state.userDetails);
  const budget = useSelector(state => state.budget);
  
  const renderHeaderMessage = page => {
    switch(page){
      case "Home":
        return (<p className="header-message">{generateWelcomeMessage(userDetails.displayName)}</p>);
      case "Budget":
      case "IncomeAndOutgo":
        return <p className="header-message" onClick={() => props.goToPage("Budget")}>{budget.name}</p>;
      default:
        return <p className="header-message">{generateWelcomeMessage(userDetails.displayName)}</p>;
    }
  }
  
  return (
    <>
      <header>
        {renderHeaderMessage(page)}
        <MenuToggle/>
      </header>
      <hr/>
    </>
  )
}

const mapDispatchToProps = {
  goToPage
}

Header.propTypes = {
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Header);