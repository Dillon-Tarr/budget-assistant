import { LOG_IN, GO_HOME, LOG_OUT, UPDATE_LOGIN_NAME, UPDATE_DISPLAY_NAME, UPDATE_EMAIL_ADDRESS, REMOVE_REMINDER, CREATE_BUDGET, ADD_GOAL, REMOVE_GOAL, MODIFY_GOAL } from '../actions/types'

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
    case GO_HOME:
      return action.payload;
    case LOG_OUT:
      return initialState;
    case UPDATE_LOGIN_NAME:
      return {...state, loginName: action.payload};
    case UPDATE_DISPLAY_NAME:
      return {...state, displayName: action.payload};
    case UPDATE_EMAIL_ADDRESS:
      return {...state, emailAddress: action.payload};
    case REMOVE_REMINDER:
      const outgoReminders = [...state.outgoReminders];
      outgoReminders.splice(action.payload, 1);
      return {...state, outgoReminders: outgoReminders};
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
    case MODIFY_GOAL: {
      const goals = state.goals.map((goal, i) => {
        if (goal._id === action.payload.goalId) return action.payload.updatedGoal;
        else return goal;
      });
      return {...state, goals: goals};
    }
    default:
      return state;
  }
}
