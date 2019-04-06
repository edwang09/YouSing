import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>{
      console.log(err)
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })}
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Google Login - Get User Token
export const loginGoogleUser = userData => dispatch => {
  console.log(userData)
  axios
    .post("/api/users/logingoogle", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Facebook Login - Get User Token
export const loginFacebookUser = userData => dispatch => {
  console.log(userData)
  axios
    .post("/api/users/loginfacebook", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Login - Get User Token
export const getUserDashboard = () => dispatch => {
  axios
    .get("/api/users/dashboard")
    .then(res => {
      // Save to localStorage
      const dashboard = res.data;
      console.log(dashboard);
      // Set current user
      dispatch(setUserDashboard(dashboard));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};


// Log user out
export const logoutUser = () => dispatch => {
  if (window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance()
    if (auth2 != null) {
      auth2.signOut().then(auth2.disconnect().then(()=>{
        console.log("logged out google")
      }))
    }
  }
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
