import { CREATE_BUDGET, OPEN_BUDGET, ADD_INCOME, ADD_OUTGO, REMOVE_INCOME, REMOVE_OUTGO, REMOVE_REMINDER } from './types';
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
  const inclusiveEndDate = setDateToMidday(new Date(values.inclusiveEndDate).getTime()).getTime().toString();
  const dollarsPerOccurrence = parseInt(values.dollarsPerOccurrence);
  let isRecurring = false;
  if (values.isRecurring === "true") isRecurring = true;
  let referencePeriod;
  let multiplesOfPeriod;
  let weekOfMonthText;
  let daysOfWeek;
  let daysOfMonth;
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
    else if (recurringType === "unusual"){
      referencePeriod = "N/A";
      multiplesOfPeriod = "N/A";
      weekOfMonthText = values.weekOfMonth;
      daysOfWeek = [values.dayOfWeek];
      daysOfMonth = ["N/A"];
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
  axios(config).then(res => dispatch({
    type: ADD_INCOME,
    payload: res.data.newIncome
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const addOutgo = (budgetId, values) => dispatch => {
  const recurringType = values.recurringType;
  const name = values.outgoName;
  const startDate = setDateToMidday(values.startDate.getTime()).getTime().toString();
  const inclusiveEndDate = setDateToMidday(new Date(values.inclusiveEndDate).getTime()).getTime().toString();
  const dollarsPerOccurrence = parseInt(values.dollarsPerOccurrence);
  let category = "Uncategorized";
  if (values.category) {
    if (values.category !== "null" && values.category !== "custom") category = values.category;
    else if (values.customCategory && values.customCategory.length >= 1 && values.customCategory.length <= 32) category = values.customCategory;
  }
  let doRemind = false;
  let remindThisManyDaysBefore = "N/A";
  if (values.doRemind === "true") {
    doRemind = true;
    remindThisManyDaysBefore = values.remindThisManyDaysBefore;
  }
  let isRecurring = false;
  if (values.isRecurring === "true") isRecurring = true;
  let referencePeriod;
  let multiplesOfPeriod;
  let weekOfMonthText;
  let daysOfWeek;
  let daysOfMonth;

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
    else if (recurringType === "unusual"){
      referencePeriod = "N/A";
      multiplesOfPeriod = "N/A";
      weekOfMonthText = values.weekOfMonth;
      daysOfWeek = [values.dayOfWeek];
      daysOfMonth = ["N/A"];
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
    url: `http://localhost:5000/api/budgets/${budgetId}/add-outgo`,
    headers: { 'x-auth-token': token },
    data: {
      name: name,
      category: category,
      startDate: startDate,
      dollarsPerOccurrence: dollarsPerOccurrence,
      doRemind: doRemind,
      remindThisManyDaysBefore: remindThisManyDaysBefore,
      isRecurring: isRecurring,
      inclusiveEndDate: inclusiveEndDate,
      referencePeriod: referencePeriod,
      multiplesOfPeriod: multiplesOfPeriod,
      weekOfMonthText: weekOfMonthText,
      daysOfWeek: daysOfWeek,
      daysOfMonth: daysOfMonth
    }};
  axios(config).then(res => dispatch({
    type: ADD_OUTGO,
    payload: res.data.newOutgo
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const removeIncome = (budgetId, incomeId) => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'delete',
    url: `http://localhost:5000/api/budgets/${budgetId}/remove-income`,
    headers: { 'x-auth-token': token },
    data: {
      incomeId: incomeId
    }};
  axios(config).then(() => dispatch({
    type: REMOVE_INCOME,
    payload: incomeId
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const removeOutgo = (budgetId, outgoId) => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'delete',
    url: `http://localhost:5000/api/budgets/${budgetId}/remove-outgo`,
    headers: { 'x-auth-token': token },
    data: {
      outgoId: outgoId
    }};
  axios(config).then(() => dispatch({
    type: REMOVE_OUTGO,
    payload: outgoId
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const muteReminder = (budgetId, outgoId, nextOccurrence, reminderIndex) => dispatch => {
  const muteRemindersUntil = (setDateToMidday(nextOccurrence).getTime() + 86400000).toString();
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'put',
    url: `http://localhost:5000/api/budgets/${budgetId}/modify-outgo`,
    headers: { 'x-auth-token': token },
    data: {
      outgoId: outgoId,
      muteRemindersUntil: muteRemindersUntil
    }};
  axios(config).then(() => dispatch({
    type: REMOVE_REMINDER,
    payload: reminderIndex
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const stopReminding = (budgetId, outgoId, reminderIndex) => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'put',
    url: `http://localhost:5000/api/budgets/${budgetId}/modify-outgo`,
    headers: { 'x-auth-token': token },
    data: {
      outgoId: outgoId,
      doRemind: false
    }};
  axios(config).then(() => dispatch({
    type: REMOVE_REMINDER,
    payload: reminderIndex
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}
