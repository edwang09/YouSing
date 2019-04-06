import { combineReducers } from "redux";
import authReducer from './authReducer';
import karaokeReducer from './karaokeReducer'
export default combineReducers({
    authReducer,
    karaokeReducer
});
