import React from 'react';
import { connect, useSelector } from 'react-redux';

import Menu from './Menu';
import Home from './pages/Home';

function Main(props) {
  const page = useSelector(state => state.view.page);
  const renderPage = page => {
    switch(page){
      case "Home":
        return <Home/>;
      default:
        return <Home/>;
    }
  }

  return (
    <>
      <Menu/>
      <main>
        {renderPage(page)}
      </main>
    </>
  )
}

export default connect(null, null)(Main);