import { LOG_IN, LOG_OUT, UPDATE_LOGIN_NAME, UPDATE_DISPLAY_NAME, UPDATE_EMAIL_ADDRESS } from './types';
import axios from 'axios'
import $ from 'jquery'

export const createAccount = async submission => dispatch => {
  let emailAddress = "";
  if (submission.emailAddress) emailAddress = submission.emailAddress;
  let config = {
    method: 'post',
    url: 'https://18.222.205.110/api/users/create-account',
    data: {
      loginName: submission.loginName,
      displayName: submission.displayName,
      password: submission.password1,
      emailAddress: emailAddress
    }};
    axios(config).then(res => {
    const token = res.headers['x-auth-token'];
    localStorage.setItem("JWT", token);
    config = {
      method: 'get',
      url: 'https://18.222.205.110/api/users/user-details',
      headers: { 'x-auth-token': token }};
    axios(config).then(res => {
      dispatch({
      type: LOG_IN,
      payload: res.data.userDetails
    })})
    .catch(err => { if (err.response) {
      console.error(err.response.data);
      return err.response.data;
    }});})
    .catch(err => { if (err.response) {
      console.error(err.response.data);
      return '5';
    }});
}

export const logIn = submission => dispatch => {
  let config = {
    method: 'post',
    url: 'https://18.222.205.110/api/auth',
    data: {
      loginNameOrEmailAddress: submission.loginNameOrEmailAddress,
      password: submission.password
    }};
  axios(config).then(res => {
  const token = res.data;
  localStorage.setItem("JWT", token);
  config = {
    method: 'get',
    url: 'https://18.222.205.110/api/users/user-details',
    headers: { 'x-auth-token': token }};
  axios(config).then(res => 
    dispatch({
    type: LOG_IN,
    payload: res.data.userDetails
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });})
  .catch(err => { if (err.response) console.error(err.response.data); });
}

export const logOut = () => dispatch => {
  $(".menu").css('display', 'none');
  $("main").css('filter', 'brightness(100%)');
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'post',
    url: 'https://18.222.205.110/api/users/log-out',
    headers: { 'x-auth-token': token }};
  axios(config).catch(err => console.error(err))
  .then(() => {
    dispatch({ type: LOG_OUT })});
}

export const updateLoginName = newLoginName => dispatch => {
  const token = localStorage.getItem("JWT");
  let config = {
    method: 'post',
    url: 'https://18.222.205.110/api/users/update-display-name',
    headers: { 'x-auth-token': token },
    data: {
      loginName: newLoginName
    }};
  axios(config).then(res => {
  localStorage.removeItem("JWT");
  const newToken = res.headers['x-auth-token'];
  localStorage.setItem("JWT", newToken);
  config = {
    method: 'get',
    url: 'https://18.222.205.110/api/users/user-details',
    headers: { 'x-auth-token': newToken }};
  axios(config).then(res => 
    dispatch({
    type: UPDATE_LOGIN_NAME,
    payload: res.data.newLoginName
  }))
  .catch(err => { if (err.response) console.error(err.response.data); });})
  .catch(err => { if (err.response) console.error(err.response.data); });
}
