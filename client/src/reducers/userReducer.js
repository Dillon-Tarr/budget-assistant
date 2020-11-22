import { LOG_IN, LOG_OUT, CREATE_BUDGET, ADD_GOAL, COMPLETE_GOAL, REMOVE_GOAL, MODIFY_GOAL } from '../actions/types'

const initialState = {
  loginName: null,
  displayName: null,
  emailAddress: null,
  managedBudgets: null,
  viewedBudgets: null,
  outgoReminders: null,
  goals: null
};

export default function userReducer(state = initialState, action){
  switch(action.type){
    case LOG_IN:
      return action.payload;
    case LOG_OUT:
      return initialState;
    case CREATE_BUDGET:
      const managedBudgets = [...state.managedBudgets];
      managedBudgets.push({ _id: action.payload._id, name: action.payload.name });
      return {...state, managedBudgets: managedBudgets};
    case ADD_GOAL: {
      const goals = [...state.goals];
      goals.push(action.payload);
      return {...state, goals: goals};
    }
    case REMOVE_GOAL: {
      const goals = state.goals.filter((goal) => goal._id !== action.payload);
      return {...state, goals: goals};
    }
    default:
      return state;
  }
}
