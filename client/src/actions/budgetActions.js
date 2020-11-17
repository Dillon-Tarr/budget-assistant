import { OPEN_BUDGET } from './types';
import axios from 'axios'

export const openBudget = budgetId => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'get',
    url: `http://localhost:5000/api/budgets/${budgetId}`,
    headers: { 'x-auth-token': token }};
  axios(config).then(res => 
    dispatch({
    type: OPEN_BUDGET,
    payload: res.data.budget
  })
  )
  .catch(err => console.error(err));
}
