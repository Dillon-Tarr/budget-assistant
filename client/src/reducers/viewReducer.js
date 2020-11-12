import { LOG_IN, LOG_OUT, GO_TO_PAGE, TOGGLE_MENU} from '../actions/types'

const initialState = {
  page: "Login",
  menuIsOpen: false,
};

export default function viewReducer(state = initialState, action){
  switch(action.type){
    case LOG_IN:
      return {...state, page: "Home"};
    case LOG_OUT:
      return initialState;
    case GO_TO_PAGE:
      return {...state, page: action.payload};
    case TOGGLE_MENU:
      return {...state, menuIsOpen: !state.menuIsOpen};
    default:
      return state;
  }
}
