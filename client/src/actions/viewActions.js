import { GO_TO_PAGE, GO_HOME, OPEN_MENU, CLOSE_MENU, LOG_OUT } from './types';
import axios from 'axios'
import $ from 'jquery'

export const goToPage = page => dispatch => {
  $(".menu").css('display', 'none');
  $("main").css('filter', 'brightness(100%)');
  dispatch({
    type: GO_TO_PAGE,
    payload: page
  });
}

export const goHome = () => dispatch => {
  $(".menu").css('display', 'none');
  $("main").css('filter', 'brightness(100%)');
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'get',
    url: 'http://localhost:5000/api/users/user-details',
    headers: { 'x-auth-token': token }};
  axios(config).then(res => {
    dispatch({
    type: GO_HOME,
    payload: res.data.userDetails
  })})
  .catch(err => {
    if (err.response) console.error(err.response.data);
    dispatch({ type: LOG_OUT });     
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
