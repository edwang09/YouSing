import { SET_CURRENT_KARAOKE } from "../actions/types";
import isEmpty from '../utils/isEmpty'
const initialState = {
  inRoom: false,
  room: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_KARAOKE:
      return {
        ...state,
        inRoom: !isEmpty(action.payload),
        room: action.payload
      };
    default:
      return state;
  }
}
