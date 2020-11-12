import { LOG_IN, LOG_OUT } from '../actions/types'

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
    default:
      return state;
  }
}
