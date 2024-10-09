import { combineReducers } from 'redux';
import userinfoeeducer from './reducers/userinforeducer';
import bookinfoeeducer from './reducers/bookinforeducer';
import bookreducer from './reducers/bookreducer';
// import bookDetailReducer from './reducers/bookDetailReducer';

const minReducer = combineReducers({
  user: userinfoeeducer,
  books: bookinfoeeducer,
  createbook: bookreducer,
  // bookDetail: bookDetailReducer,
});

export default minReducer;
