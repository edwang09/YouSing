import { combineReducers } from "redux";
import authReducer from './authReducer';
import modalReducer from './modalReducer';
import karaokeReducer from './karaokeReducer'
export default combineReducers({
    auth : authReducer,
    karaoke : karaokeReducer,
    modal : modalReducer
});
