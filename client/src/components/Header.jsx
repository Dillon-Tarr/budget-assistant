import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { generateWelcomeMessage } from '../helpers/string-generators';
import { goToPage, goHome } from '../actions/viewActions';
import { openBudget } from '../actions/budgetActions';

import MenuToggle from './MenuToggle';

function Header(props) {
  const page = useSelector(state => state.view.page);
  const userDetails = useSelector(state => state.userDetails);
  const budget = useSelector(state => state.budget);
  
  const renderHeaderMessage = page => {
    switch(page){
      case "Home":
        return (<p className="default-cursor header-message">{generateWelcomeMessage(userDetails.displayName)}</p>);
      case "Budget":
        return <p className="default-cursor header-message">{budget.name}</p>;
      case "IncomeAndOutgo":
        return <p className="clickable header-message" onClick={() => props.openBudget(budget._id)}>{budget.name}</p>;
      case "FutureValueCalculator":
        return <p className="clickable header-message" onClick={() => props.goToPage("Budget")}>{budget.name}</p>;
      default:
        return <p className="clickable header-message" onClick={() => props.goHome()}>Budget Assistant</p>;
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
  goHome,
  openBudget
}

Header.propTypes = {
  goToPage: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
  openBudget: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Header);