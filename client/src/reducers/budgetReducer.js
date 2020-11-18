import { LOG_OUT, CREATE_BUDGET, OPEN_BUDGET } from '../actions/types'

const initialState = {
  managers: null,
  viewers: null,
  name: null,
  income: null,
  outgo: null,
  changeHistory: null,
  requestedChanges: null
};

export default function userReducer(state = initialState, action){
  switch(action.type){
    case LOG_OUT:
      return initialState;
    case CREATE_BUDGET:
    case OPEN_BUDGET:
      return action.payload;
    default:
      return state;
  }
}
