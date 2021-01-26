import axios from 'axios';

const urlLogin = `/api/v1/users/login`;
const urlSignup = `/api/v1/users/signup`;
const urlLogout = `/api/v1/users/logout`;

const urlForgotPassword = `/api/v1/users/forgotPassword`;
const urlResetPassword = `/api/v1/users/resetPassword`;

const urlUserInfo = `/api/v1/users/me`;
const urlUserProfile = `/api/v1/users/profile`;
const urlUpdatePassword = `/api/v1/users/updatePassword`;
const urlUpdateUser = `/api/v1/users/updateMe`;
// const urlDeleteUser = `/api/v1/users/`;

export function loginService(email, password) {
   return axios.post(urlLogin, {
      email,
      password
   });
}

export function signupService(username, email, password, passwordConfirm) {
   return axios.post(urlSignup, {
      username, email, password, passwordConfirm
   });
}

export function forgotPasswordService(email) {
   return axios.post(urlForgotPassword, {
      email
   });
}

export function resetPasswordService(resetToken, password, passwordConfirm) {
   return axios.patch(`${urlResetPassword}/${resetToken}`, {
      password,
      passwordConfirm
   });
}

export function logoutService() {
   return axios.get(urlLogout);
}

export function getUserInfo() {
   return axios.get(urlUserInfo);
}

export function getUserProfile(username) {
   // return axios.get(`${urlUserProfile}/${name.replace(/\%20/g, " ")}`)
   return axios.get(`${urlUserProfile}/${username}`)
}

export function updatePasswordService(data) {
   return axios.patch(urlUpdatePassword,
      data
   );
}

export function updateUserService(data) {
   return axios.patch(urlUpdateUser,
      data
   );
}

// export function deleteUserService(password, passwordConfirm) {
//    return axios.patch(urlUpdatePassword, {
//       password,
//       passwordConfirm
//    });
// }