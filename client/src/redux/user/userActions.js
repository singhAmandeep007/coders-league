import { userActionTypes } from './userActionTypes';
import * as services from './../../services/userApi';
import { generateErrorMessage, generateSuccessMessage } from './userUtils';

///////////// LOGIN ///////////
export function loginStart() {
   return {
      type: userActionTypes.LOGIN_START,
      message: { for: 'login' }
   };
}
export function setLoginSuccessMessage() {
   return {
      type: userActionTypes.SET_LOGIN_SUCCESS_MESSAGE,
      message: generateSuccessMessage('Successfully Logged In.', 'login')
   }
}
export function loginSuccess(userData) {
   return {
      type: userActionTypes.LOGIN_SUCCESS,
      payload: { ...userData }
   }
}
export function loginError(err) {
   return {
      type: userActionTypes.LOGIN_ERROR,
      message: generateErrorMessage(err.data.message || 'Incorrect Email or Password.', 'login')
   };
}
///////////// SIGNUP ///////////
export function signupStart() {
   return {
      type: userActionTypes.SIGNUP_START,
      message: { for: 'signup' }
   };
}
export function setSignupSuccessMessage() {
   return {
      type: userActionTypes.SET_SIGNUP_SUCCESS_MESSAGE,
      message: generateSuccessMessage('Successfully Signed Up.', 'signup')
   }
}
export function signupSuccess(userData) {
   return {
      type: userActionTypes.SIGNUP_SUCCESS,
      payload: { ...userData }
   };
}
export function signupError(err) {
   return {
      type: userActionTypes.SIGNUP_ERROR,
      message: generateErrorMessage(err.data.message || 'SignUp Failed.', 'signup')
   };
}
///////////// LOGOUT ///////////
export function logoutStart() {
   return {
      type: userActionTypes.LOGOUT_START,
      message: { for: 'logout' }
   };
}
export function logoutSuccess() {
   return {
      type: userActionTypes.LOGOUT_SUCCESS,
      message: generateSuccessMessage('Successfully Logged out.', 'logout')
   };
}
export function logoutError() {
   return {
      type: userActionTypes.LOGOUT_ERROR,
      message: generateErrorMessage('Logout Failed.', 'logout')
   };
}
///////////// FORGOTPASSWORD ///////////
export function forgotPasswordStart() {
   return {
      type: userActionTypes.FORGOTPASSWORD_START,
      message: { for: 'forgotPassword' }
   };
}
export function setForgotPasswordSuccessMessage() {
   return {
      type: userActionTypes.SET_FORGOTPASSWORD_SUCCESS_MESSAGE,
      message: generateSuccessMessage('Successfully Sent Password Reset Mail.', 'forgotPassword')
   };
}
export function forgotPasswordError(err) {
   return {
      type: userActionTypes.FORGOTPASSWORD_ERROR,
      message: generateErrorMessage(err.data.message || 'Failed to send Email.', 'forgotPassword')
   };
}
///////////// RESETPASSWORD ///////////
export function resetPasswordStart() {
   return {
      type: userActionTypes.RESETPASSWORD_START,
      message: { for: 'resetPassword' }
   };
}
export function setResetPasswordSuccessMessage() {
   return {
      type: userActionTypes.SET_RESETPASSWORD_SUCCESS_MESSAGE,
      message: generateSuccessMessage('Your password has been reset successfully!', 'resetPassword')
   };
}
export function resetPasswordError(err) {
   return {
      type: userActionTypes.RESETPASSWORD_ERROR,
      message: generateErrorMessage(err.data.message || 'Failed to Reset Password.', 'resetPassword')
   };
}
///////////// UPDATEPASSWORD ///////////
export function updatePasswordStart() {
   return {
      type: userActionTypes.UPDATEPASSWORD_START,
      message: { for: 'updatePassword' }
   };
}
export function setUpdatePasswordSuccessMessage() {
   return {
      type: userActionTypes.SET_UPDATEPASSWORD_SUCCESS_MESSAGE,
      message: generateSuccessMessage('Your password has been updated successfully!', 'updatePassword')
   };
}
export function updatePasswordError(err) {
   return {
      type: userActionTypes.UPDATEPASSWORD_ERROR,
      message: generateErrorMessage(err.data.message || 'Failed to update password.', 'updatePassword')
   };
}

export function login(email, password) {
   return dispatch => {
      dispatch(loginStart());

      services.loginService(email, password).then(
         (response) => {
            console.log(response)
            dispatch(setLoginSuccessMessage())
            setTimeout(() => {
               localStorage.setItem('jtoken', response.data.token);
               dispatch(loginSuccess(response.data.data.user));
            }, 1000)
         },
         err => {
            dispatch(loginError(err.response));
         }
      );
   };
}
export function signup(username, email, password, passwordConfirm) {
   return dispatch => {
      dispatch(signupStart());

      services.signupService(username, email, password, passwordConfirm).then(
         response => {
            console.log(response)
            dispatch(setSignupSuccessMessage())
            setTimeout(() => {
               localStorage.setItem('jtoken', response.data.token);
               dispatch(signupSuccess(response.data.data.user));
            }, 1000)
         },
         err => {
            dispatch(signupError(err.response));
         }
      );
   };
}
export function logout() {
   return dispatch => {
      dispatch(logoutStart());

      services.logoutService().then(
         response => {
            // console.log(response)
            // console.log('logout')
            localStorage.removeItem('jtoken');
            dispatch(logoutSuccess(response.data));
         },
         err => {
            dispatch(logoutError(err.response));
         }
      );
   };
}
export function forgotPassword(email) {
   return dispatch => {
      dispatch(forgotPasswordStart())
      services.forgotPasswordService(email).then(
         (response) => {
            // console.log(response)
            dispatch(setForgotPasswordSuccessMessage())
         },
         err => {
            // console.log(err)
            dispatch(forgotPasswordError(err.response));
         }
      );
   };
}
export function resetPassword(resetToken, password, passwordConfirm) {
   return dispatch => {
      dispatch(resetPasswordStart())
      services.resetPasswordService(resetToken, password, passwordConfirm).then(
         (response) => {
            console.log(response)
            dispatch(setResetPasswordSuccessMessage())
            setTimeout(() => {
               localStorage.setItem('jtoken', response.data.token);
               dispatch(loginSuccess(response.data.data.user));
            }, 1000)
         },
         err => {
            dispatch(resetPasswordError(err.response));
         }
      );
   };
}

export function updatePassword(data) {
   return dispatch => {
      dispatch(updatePasswordStart())
      services.updatePasswordService(data).then(
         (response) => {
            console.log(response)
            dispatch(setUpdatePasswordSuccessMessage())
            dispatch(updateUserInfo(response.data.data.user))
            localStorage.setItem('jtoken', response.data.token);
         },
         err => {
            dispatch(updatePasswordError(err.response));
         }
      );
   };
}

export function getUserInfo() {
   return async dispatch => {
      services.getUserInfo().then(
         (response) => {
            if (response.data) {
               dispatch(loginSuccess(response.data.data));
            }
         },
         err => {
            // need to handle error in someway
            console.log(err.response)
         }
      );
   };
}

export function updateUserInfo(userData) {
   return {
      type: userActionTypes.UPDATE_USER,
      payload: { ...userData }
   }
}
