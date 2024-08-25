import { combineReducers } from 'redux';
import userinfoeeducer from './reducers/userinforeducer';
import bookinfoeeducer from './reducers/bookinforeducer'
const minReducer = combineReducers({
    user: userinfoeeducer,
    books: bookinfoeeducer
});
export default minReducer;