/** Constants */
import { SHOW_MODAL, HIDE_MODAL } from "../actions/modalActions";

/** Initial State */
const initialModalState = {
  modalType: null,
  options: {}
};

/** Modal reducer */
export default function(state = initialModalState, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case SHOW_MODAL:
      newState.modalType = action.modalType;
      newState.options = action.options;
      break;

    case HIDE_MODAL:
      return initialModalState;

    default:
      return state;
  }

  return newState;
}
