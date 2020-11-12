import { GO_TO_PAGE, TOGGLE_MENU } from './types';

export const goToPage = page => dispatch => {
  dispatch({
    type: GO_TO_PAGE,
    payload: page
  });
}

export const toggleMenu = dispatch => {
  dispatch({
    type: TOGGLE_MENU
  });
}
