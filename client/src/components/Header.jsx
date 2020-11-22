import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { generateWelcomeMessage } from '../helpers/string-generators';
import { goToPage } from '../actions/viewActions';
import { openBudget } from '../actions/budgetActions';

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
        return <p className="header-message" onClick={() => props.openBudget(budget._id)}>{budget.name}</p>;
      default:
        return <p className="header-message" onClick={() => props.goToPage("Home")}>Budget Assistant</p>;
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
  goToPage,
  openBudget
}

Header.propTypes = {
  goToPage: PropTypes.func.isRequired,
  openBudget: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Header);