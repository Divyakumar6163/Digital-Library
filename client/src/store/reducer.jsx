import { combineReducers } from "redux";
import userinfoeeducer from "./reducers/userinforeducer";
import bookinfoeeducer from "./reducers/bookinforeducer";
import headingReducer from "./reducers/headingSlice";
import textReducer from "./reducers/textSlice";
// import bookDetailReducer from "./reducers/bookDetailReducer";

const minReducer = combineReducers({
  user: userinfoeeducer,
  books: bookinfoeeducer,
  heading: headingReducer,
  text: textReducer,
  // bookDetail: bookDetailReducer,
});

export default minReducer;
