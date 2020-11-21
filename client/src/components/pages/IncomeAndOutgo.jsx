import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { goToPage } from '../../actions/viewActions';
import Income from '../Income';
import Outgo from '../Outgo';

function IncomeAndOutgo(props) {
  return (
    <div id="income-and-outgo">
      <Income/>
      <hr/>
      <Outgo/>
    </div>
  )
}

const mapDispatchToProps = {
  goToPage
}

IncomeAndOutgo.propTypes = {
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(IncomeAndOutgo);