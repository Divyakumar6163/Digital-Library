import { combineReducers } from "redux";
import userinfoeeducer from "./reducers/userinforeducer";
import bookinfoeeducer from "./reducers/bookinforeducer";
// import bookDetailReducer from "./reducers/bookDetailReducer";

const minReducer = combineReducers({
  user: userinfoeeducer,
  books: bookinfoeeducer,
  // bookDetail: bookDetailReducer,
});

export default minReducer;
