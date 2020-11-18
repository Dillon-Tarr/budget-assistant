import { LOG_IN, LOG_OUT, GO_TO_PAGE, OPEN_MENU, CLOSE_MENU, CREATE_BUDGET, OPEN_BUDGET } from '../actions/types'

const initialState = {
  page: "Login",
  menuIsOpen: false
};

export default function viewReducer(state = initialState, action){
  switch(action.type){
    case LOG_IN:
      return {...state, page: "Home"};
    case LOG_OUT:
      return initialState;
    case GO_TO_PAGE:
      return {...state, page: action.payload, menuIsOpen: false};
    case OPEN_MENU:
      return {...state, menuIsOpen: true};
    case CLOSE_MENU:
      return {...state, menuIsOpen: false};
    case CREATE_BUDGET:
    case OPEN_BUDGET:
      return {...state, page: "Budget"};
    default:
      return state;
  }
}
