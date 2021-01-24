import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './rootReducer';

const persistConfig = {
   key: 'root',
   storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
// for saved in user
// import jwtDecode from 'jwt-decode';
// import setAuthToken from './setAuthToken';
// import { logoutUser, setCurrentUser } from './actions/authActions';

// if (localStorage.jwtToken) {
//   setAuthToken(localStorage.jwtToken);
//   const decoded = jwtDecode(localStorage.jwtToken);
//   store.dispatch(setCurrentUser(decoded));

//   const currentTime = Date.now() / 1000;
//   if (decoded.exp < currentTime) {
//     store.dispatch(logoutUser());
//     window.location.href = '/login';
//   }
// }

// const initialState = {
//    posts: [],
//    user: {}
// };


export const store = createStore(
   persistedReducer,
   composeWithDevTools(applyMiddleware(thunk, logger))
)
export const persistor = persistStore(store);
