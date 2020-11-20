import { LOG_OUT, CREATE_BUDGET, OPEN_BUDGET, ADD_INCOME } from '../actions/types'

const initialState = {
  managers: null,
  viewers: null,
  name: null,
  income: null,
  outgo: null,
  changeHistory: null,
  requestedChanges: null
};

export default function budgetReducer(state = initialState, action){
  switch(action.type){
    case LOG_OUT:
      return initialState;
    case CREATE_BUDGET:
    case OPEN_BUDGET:
      return action.payload;
    case ADD_INCOME:
      const income = {...state.income};
      income.push(action.payload);
      return {...state, income: income};
    default:
      return state;
  }
}
