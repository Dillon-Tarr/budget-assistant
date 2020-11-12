import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logOut } from '../actions/accountActions'
import { goToPage } from '../actions/viewActions'

function Home(props) {

  return (
    <>
    <button onClick={() => props.logOut()}>Log out</button>
    </>
  )
}

const mapDispatchToProps = {
  logOut,
  goToPage
}

Home.propTypes = {
  logOut: PropTypes.func.isRequired,
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Home);