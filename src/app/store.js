import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer, { restoreAuth } from '../features/auth/authSlice';
import todoReducer from '../features/todo/todoSlice';


// combined reducers
const rootReducer = combineReducers({
  auth: authReducer,
  todos: todoReducer,
});



//store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});



// persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','todos'] 
};
// persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);






// persistor
export const persistor = persistStore(store);






const initializeAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      store.dispatch(restoreAuth({ token, user: parsedUser }));
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};


initializeAuth();

export default store;