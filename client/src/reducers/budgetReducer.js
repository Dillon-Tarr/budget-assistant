import { LOG_OUT, CREATE_BUDGET, OPEN_BUDGET, ADD_INCOME, ADD_OUTGO, REMOVE_INCOME, REMOVE_OUTGO } from '../actions/types'

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
    case ADD_INCOME: {
      const income = [...state.income];
      income.push(action.payload);
      return {...state, income: income};
    }
    case ADD_OUTGO: {
      const outgo = [...state.outgo];
      outgo.push(action.payload);
      return {...state, outgo: outgo};
    }
      case REMOVE_INCOME: {
      const income = state.income.filter((incomeObject) => incomeObject._id !== action.payload);
      return {...state, income: income};
    }
    case REMOVE_OUTGO: {
      const outgo = state.outgo.filter((outgoObject) => outgoObject._id !== action.payload);
      return {...state, outgo: outgo};
    }
    default:
      return state;
  }
}
