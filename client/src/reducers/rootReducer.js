import { combineReducers } from 'redux';
import userReducer from './userReducer';
import viewReducer from './viewReducer';
import budgetReducer from './budgetReducer';

export default combineReducers({
    userDetails: userReducer,
    view: viewReducer,
    budget: budgetReducer
});