import { SET_CURRENT_KARAOKE } from "../actions/types";
import isEmpty from '../utils/isEmpty'
const initialState = {
  inRoom: false,
  roomid: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_KARAOKE:
      return {
        ...state,
        inRoom: !isEmpty(action.payload),
        roomid: action.payload
      };
    default:
      return state;
  }
}
