import { LOG_OUT, OPEN_BUDGET } from '../actions/types'

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
    case OPEN_BUDGET:
      return action.payload;
    default:
      return state;
  }
}
