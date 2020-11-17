import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { goToPage } from '../../actions/viewActions';

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

  if (userDetails.managedBudgets.length/* + userDetails.viewedBudgets.length*/ < 1) {
    return (
      <div className="home">
        <p>Get started by...</p>
        <button className="main-button">Creating a budget</button><br/>
        <button className="main-button">Learning about budgeting</button>
      </div>
    )
  }
else return (
    <>
      <div className="home">
        <div>
          <p>What's next?</p>
          <button className="main-button" onClick={() => props.goToPage("Budgets")}>Budgets</button><br/>
          <button className="main-button" onClick={() => props.goToPage("Goals")}>Goals</button><br/>
          <button className="main-button" onClick={() => props.goToPage("Learn")}>Learn</button>
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
  goToPage
}

Home.propTypes = {
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Home);