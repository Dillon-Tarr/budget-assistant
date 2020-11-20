import { LOG_IN, LOG_OUT } from './types';
import axios from 'axios'
import $ from 'jquery'

export const createAccount = submission => dispatch => {
  let emailAddress = "";
  if (submission.emailAddress) emailAddress = submission.emailAddress;
  let config = {
    method: 'post',
    url: 'http://localhost:5000/api/users/create-account',
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
      url: 'http://localhost:5000/api/users/user-details',
      headers: { 'x-auth-token': token }};
    axios(config).then(res => {
      dispatch({
      type: LOG_IN,
      payload: res.data.userDetails
    })})
    .catch(err => { if (err.response) console.error(err.response.data); });})
    .catch(err => { if (err.response) console.error(err.response.data); });
}

export const logIn = submission => dispatch => {
  let config = {
    method: 'post',
    url: 'http://localhost:5000/api/auth',
    data: {
      loginNameOrEmailAddress: submission.loginNameOrEmailAddress,
      password: submission.password
    }};
  axios(config).then(res => {
  const token = res.data;
  localStorage.setItem("JWT", token);
  config = {
    method: 'get',
    url: 'http://localhost:5000/api/users/user-details',
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
  $(".menu").css('right', 'initial');
  $("main").css('filter', 'brightness(100%)');
  const token = localStorage.getItem("JWT");
  const config = {
    method: 'post',
    url: 'http://localhost:5000/api/users/log-out',
    headers: { 'x-auth-token': token }};
  axios(config).catch(err => console.error(err))
  .then(() => {
    dispatch({
    type: LOG_OUT
  })});
}
