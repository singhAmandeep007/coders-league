import { userActionTypes } from './userActionTypes';
//import { setLoginErrorMessage, setLoginSuccessMessage, setErrorMessage } from './userUtils';

const initialState = {
   isFetching: null,
   isAuthenticated: null,
   currentUser: null,
   userMessage: null
};

const userReducer = function (state = initialState, action) {
   switch (action.type) {

      case userActionTypes.SIGNUP_START:
         return { ...state, isFetching: true, userMessage: action.message };
      case userActionTypes.SET_SIGNUP_SUCCESS_MESSAGE:
         return { ...state, isFetching: false, userMessage: action.message };
      case userActionTypes.SIGNUP_SUCCESS:
         return { ...state, isAuthenticated: true, currentUser: action.payload };
      case userActionTypes.SIGNUP_ERROR:
         return { ...state, isFetching: false, userMessage: action.message };


      case userActionTypes.LOGIN_START:
         return { ...state, isFetching: true, userMessage: action.message };
      case userActionTypes.SET_LOGIN_SUCCESS_MESSAGE:
         return { ...state, isFetching: false, userMessage: action.message };
      case userActionTypes.LOGIN_SUCCESS:
         return { ...state, isAuthenticated: true, currentUser: action.payload };
      case userActionTypes.LOGIN_ERROR:
         return { ...state, isFetching: false, userMessage: action.message };


      case userActionTypes.LOGOUT_START:
         return { ...state, isFetching: true };
      case userActionTypes.LOGOUT_SUCCESS:
         return { ...state, isFetching: false, isAuthenticated: false, currentUser: null, userMessage: action.message, userFollowing: null };
      case userActionTypes.LOGOUT_ERROR:
         return { ...state, isFetching: false, userMessage: action.message };

      case userActionTypes.FORGOTPASSWORD_START:
         return { ...state, isFetching: true, userMessage: action.message };
      case userActionTypes.SET_FORGOTPASSWORD_SUCCESS_MESSAGE:
         return { ...state, isFetching: false, userMessage: action.message };
      case userActionTypes.FORGOTPASSWORD_ERROR:
         return { ...state, isFetching: false, userMessage: action.message };


      case userActionTypes.RESETPASSWORD_START:
         return { ...state, isFetching: true, userMessage: action.message };
      case userActionTypes.SET_RESETPASSWORD_SUCCESS_MESSAGE:
         return { ...state, isFetching: false, userMessage: action.message };
      case userActionTypes.RESETPASSWORD_ERROR:
         return { ...state, isFetching: false, userMessage: action.message };

      case userActionTypes.UPDATEPASSWORD_START:
         return { ...state, isFetching: true, userMessage: action.message };
      case userActionTypes.SET_UPDATEPASSWORD_SUCCESS_MESSAGE:
         return { ...state, isFetching: false, userMessage: action.message };
      case userActionTypes.UPDATEPASSWORD_ERROR:
         return { ...state, isFetching: false, userMessage: action.message };

      case userActionTypes.UPDATE_USER:
         return { ...state, currentUser: action.payload };

      case "GET_USER_FOLLOWING":
         return { ...state, userFollowing: action.payload };

      case "SET_USER_FOLLOWING":
         let findUserId = state.userFollowing.indexOf(action.payload);
         if (findUserId === -1) {
            return {
               ...state,
               userFollowing: [...state.userFollowing, action.payload]
            };
         } else {
            return {
               ...state,
               userFollowing: state.userFollowing.filter(userId => userId !== action.payload)
            };
         }

      case "DISMISS_MESSAGE_USER":
         return { ...state, userMessage: action.message };

      default:
         return state;
   }
}

export default userReducer;