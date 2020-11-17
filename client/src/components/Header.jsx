import React from 'react';
import { connect, useSelector } from 'react-redux';

import { generateWelcomeMessage } from '../helpers/message-generators';

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
        return <p className="header-message">{budget.name}</p>;
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

export default connect(null, null)(Header);