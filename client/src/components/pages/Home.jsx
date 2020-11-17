import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { openMenu, closeMenu } from '../../actions/viewActions';

import Welcome from '../Welcome';
import Header from '../Header';

function Home(props) {
  const userDetails = useSelector(state => state.userDetails);
  const renderReminders = () => {
    const reminders = [];
    for (let i = 0; i < userDetails.outgoReminders.length; i++){
      reminders.push(
        <p className="reminder" key={`reminder${i}`}>
          {userDetails.outgoReminders[i]}
        </p>
        );
    }
    return reminders;
  }

  if (userDetails.managedBudgets.length + userDetails.viewedBudgets.length < 1) {
    return (
      <>
        <Header/>
        <div className="home">
          <p>Get started by...</p>
          <button className="main-button">Creating a budget</button><br/><br/>
          <button className="main-button">Learning about budgeting</button>
        </div>
      </>
    )
  }
else return (
    <>
      <Header/>
      <div className="home">
        <div>
          <p>What's next?</p>
          <button className="main-button">Budgets</button><br/><br/>
          <button className="main-button">Goals</button><br/><br/>
          <button className="main-button">Learn</button>
        </div>
        <div className="reminders">
          <p>Outgo reminders:</p>
          {renderReminders()}
        </div>
      </div>
    </>
  )
  
}

const mapDispatchToProps = {
  openMenu,
  closeMenu
}

Home.propTypes = {
  openMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Home);