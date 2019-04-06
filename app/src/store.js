import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

const initialState = {};

const middleware = [thunk];
const composeEnhancer =
  process.env.NODE_ENV !== "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: "App",
        actionBlacklist: ["REDUX_STORAGE_SAVE"]
      })
    : compose;
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancer(applyMiddleware(...middleware))
);

export default store;
