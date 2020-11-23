import React from 'react';
import { connect, useSelector } from 'react-redux';

import Menu from './Menu';

import Home from './pages/Home';
import Budgets from './pages/Budgets';
import Budget from './pages/Budget';
import Header from './Header';
import IncomeAndOutgo from './pages/IncomeAndOutgo';
import Goals from './pages/Goals';
import Learn from './pages/Learn';

function Main(props) {
  const page = useSelector(state => state.view.page);
  const renderPage = page => {
    switch(page){
      case "Home":
        return <Home/>;
      case "Learn":
        return <Learn/>;
      case "Budgets":
        return <Budgets/>;
      case "Budget":
        return <Budget/>;
      case "IncomeAndOutgo":
        return <IncomeAndOutgo/>;
      case "FutureValueCalculator":
        return <Home/>;
      case "Goals":
        return <Goals/>;
      default:
        return <Home/>;
    }
  }

  return (
    <>
      <Menu/>
      <main>
        <Header/>
        {renderPage(page)}
      </main>
    </>
  )
}

export default connect(null, null)(Main);