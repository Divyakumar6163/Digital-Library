import { legacy_createStore as createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from '@redux-devtools/extension';
import minReducer from './reducer'; 

const persistConfig = {
  key: 'root',
  storage, 
  whitelist: ['auth', 'books','createbook']
};
const persistedReducer = persistReducer(persistConfig, minReducer);
export const store = createStore(
  persistedReducer,
  composeWithDevTools()
);

export const persistor = persistStore(store);

export default store;
