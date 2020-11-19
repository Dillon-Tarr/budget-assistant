import { CREATE_BUDGET, OPEN_BUDGET, ADD_INCOME } from './types';
import axios from 'axios'

export const createBudget = name => dispatch => {
  const token = localStorage.getItem("JWT");
  let config = {
    method: 'post',
    url: `http://localhost:5000/api/budgets/new-budget`,
    headers: { 'x-auth-token': token },
    data: { name: name }};
  axios(config).then(res => {
  config = {
    method: 'get',
    url: `http://localhost:5000/api/budgets/${res.data.budget._id}`,
    headers: { 'x-auth-token': token }};
  axios(config).then(res => 
    dispatch({
    type: CREATE_BUDGET,
    payload: res.data.budget
  }))
  .catch(err => console.error(err));})
  .catch(err => console.error(err));
}

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

export const addIncome = () => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'post',
    url: `http://localhost:5000/api/budgets/${budgetId}/add-income`,
    headers: { 'x-auth-token': token }};
  axios(config).then(res => 
    dispatch({
    type: ADD_INCOME,
    payload: res.data.budget
  })
  )
  .catch(err => console.error(err));
}
