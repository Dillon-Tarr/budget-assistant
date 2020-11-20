import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { goToPage } from '../../actions/viewActions';
import Income from '../Income';

function IncomeAndOutgo(props) {
  const budget = useSelector(state => state.budget);

  return (
    <div id="income-and-outgo">
      <Income/>
      <hr/>
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