import { ADD_GOAL, COMPLETE_GOAL, REMOVE_GOAL, MODIFY_GOAL } from './types';
import axios from 'axios'
import { setDateToMidday } from '../helpers/manipulate-dates'

export const addGoal = (text, estimatedCompletionDate) => dispatch => {
  const data = { text: text };
  if (estimatedCompletionDate) data.estimatedCompletionDate = setDateToMidday(estimatedCompletionDate.getTime()).getTime().toString();
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'post',
    url: `http://localhost:5000/api/users/add-goal`,
    headers: { 'x-auth-token': token },
    data: data};
  axios(config).then(res => dispatch({
    type: ADD_GOAL,
    payload: res.data.newGoal
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const removeGoal = (goalId) => dispatch => {
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'delete',
    url: `http://localhost:5000/api/users/remove-goal`,
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
