import { GO_TO_PAGE, OPEN_MENU, CLOSE_MENU } from './types';
import $ from 'jquery'

export const goToPage = page => dispatch => {
  $(".menu").css('display', 'none');
  $("main").css('filter', 'brightness(100%)');
  dispatch({
    type: GO_TO_PAGE,
    payload: page
  });
}

export const openMenu = () => dispatch => {
  $(".menu").css('display', 'flex');
  $("main").css('filter', 'brightness(50%)');
  dispatch({
    type: OPEN_MENU
  });
}

export const closeMenu = () => dispatch => {
  $(".menu").css('display', 'none');
  $("main").css('filter', 'brightness(100%)');
  dispatch({
    type: CLOSE_MENU
  });
}
