import { LOG_IN, LOG_OUT, CREATE_BUDGET } from '../actions/types'

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
    default:
      return state;
  }
}
