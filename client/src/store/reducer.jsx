import { combineReducers } from 'redux';
import userinfoeeducer from './reducers/userinforeducer';

const minReducer = combineReducers({
    user: userinfoeeducer
});
export default minReducer;