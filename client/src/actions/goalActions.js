import { ADD_GOAL, REMOVE_GOAL, MODIFY_GOAL } from './types';
import axios from 'axios'
import { setDateToMidday } from '../helpers/manipulate-dates'

export const addGoal = (text, estimatedCompletionDate) => dispatch => {
  const data = { text: text };
  if (estimatedCompletionDate) data.estimatedCompletionDate = setDateToMidday(estimatedCompletionDate.getTime()).getTime().toString();
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'post',
    url: `https://18.222.205.110/api/users/add-goal`,
    headers: { 'x-auth-token': token },
    data: data};
  axios(config).then(res => dispatch({
    type: ADD_GOAL,
    payload: res.data.newGoal
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const completeGoal = (goalId, isComplete) => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'put',
    url: `https://18.222.205.110/api/users/modify-goal`,
    headers: { 'x-auth-token': token },
    data: {
      goalId: goalId,
      isComplete: !isComplete
    }};
  axios(config).then(res => dispatch({
    type: MODIFY_GOAL,
    payload: {
      goalId: goalId,
      updatedGoal: res.data.updatedGoal
    }
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const modifyGoal = (goal, values) => dispatch => {
  console.log(values);
  const data = { goalId: goal._id };
  if (values.goalText && values.goalText !== goal.text) data.text = values.goalText;
  if (values.isComplete === "true" || (values.isComplete !== "false" && goal.isComplete === true)){
    data.isComplete = true;
    if (values.completedDate) data.completedDate = setDateToMidday(values.completedDate.getTime()).getTime().toString();
  }
  else if (values.isComplete === "false" || (values.isComplete !== "true" && goal.isComplete === false)){
    data.isComplete = false;
    if (values.notSure) data.estimatedCompletionDate = false;
    else if (values.estimatedCompletionDate) data.estimatedCompletionDate = setDateToMidday(values.estimatedCompletionDate.getTime()).getTime().toString();
  }
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'put',
    url: `https://18.222.205.110/api/users/modify-goal`,
    headers: { 'x-auth-token': token },
    data: data};
  axios(config).then(res => dispatch({
    type: MODIFY_GOAL,
    payload: {
      goalId: goal._id,
      updatedGoal: res.data.updatedGoal
    }
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const removeGoal = (goalId) => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'delete',
    url: `https://18.222.205.110/api/users/remove-goal`,
    headers: { 'x-auth-token': token },
    data: {
      goalId: goalId
    }};
  axios(config).then(res => dispatch({
    type: REMOVE_GOAL,
    payload: goalId
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

