import axios from "axios";
import {  SET_CURRENT_KARAOKE } from "./types";

// Login - Get User Token
export const setKaraoke = userData => dispatch => {
      dispatch({
        type: SET_CURRENT_KARAOKE,
        payload: userData.roomid
      });
};
