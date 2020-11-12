import { combineReducers } from 'redux';
import userReducer from './userReducer';
import viewReducer from './viewReducer';

export default combineReducers({
    userDetails: userReducer,
    view: viewReducer
});