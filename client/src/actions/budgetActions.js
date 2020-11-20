import { CREATE_BUDGET, OPEN_BUDGET, ADD_INCOME } from './types';
import axios from 'axios'
import { setDateToMidday } from '../helpers/manipulate-dates'
import { convertFromDayXToNumbers } from '../helpers/manipulate-numbers'

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
  .catch(err => { if (err.response) console.error(err.response.data); });})
  .catch(err => { if (err.response) console.error(err.response.data); });
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
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const addIncome = (budgetId, values) => dispatch => {
  const recurringType = values.recurringType;
  const name = values.incomeName;
  const startDate = setDateToMidday(values.startDate.getTime()).getTime().toString();
  const inclusiveEndDate = setDateToMidday(values.inclusiveEndDate.getTime()).getTime().toString();
  const dollarsPerOccurrence = parseInt(values.dollarsPerOccurrence);
  let isRecurring = false;
  let referencePeriod;
  let multiplesOfPeriod;
  let weekOfMonthText;
  let daysOfWeek;
  let daysOfMonth;
  if (values.isRecurring === "true") isRecurring = true;
  if (isRecurring){
    if (recurringType === "normal"){
      referencePeriod = values.referencePeriod;
      multiplesOfPeriod = values.multiplesOfPeriod;
      if (referencePeriod === "week") daysOfWeek = [...values.daysOfWeek];
      else daysOfWeek = ["N/A"];
      if (referencePeriod === "month") daysOfMonth = convertFromDayXToNumbers(values.daysOfMonth);
      else daysOfMonth = ["N/A"];
      weekOfMonthText = "N/A";
    }
    else if (recurringType === "weird"){
      referencePeriod = "N/A";
      multiplesOfPeriod = "N/A";
      weekOfMonthText = values.weekOfMonth;
      daysOfWeek = [values.dayOfWeek];
    }
  }
  else {
    referencePeriod = "N/A";
    multiplesOfPeriod = "N/A";
    weekOfMonthText = "N/A";
    daysOfWeek = ["N/A"];
    daysOfMonth = ["N/A"];
  }
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'post',
    url: `http://localhost:5000/api/budgets/${budgetId}/add-income`,
    headers: { 'x-auth-token': token },
    data: {
      name: name,
      startDate: startDate,
      dollarsPerOccurrence: dollarsPerOccurrence,
      isRecurring: isRecurring,
      inclusiveEndDate: inclusiveEndDate,
      referencePeriod: referencePeriod,
      multiplesOfPeriod: multiplesOfPeriod,
      weekOfMonthText: weekOfMonthText,
      daysOfWeek: daysOfWeek,
      daysOfMonth: daysOfMonth
    }};
  axios(config).then(res => { // The .then() is not happening, though the catch does work if an error occurs. The problem is not with anything at or below this line, based on my testing.
    console.log('Something...');
    dispatch({
    type: ADD_INCOME,
    payload: res.data.newIncome
  })})
  .catch(err => { if (err.response) console.error(err.response.data); });
}
