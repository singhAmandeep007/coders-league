import axios from 'axios';

const urlLogin = `/api/v1/users/login`;
const urlSignup = `/api/v1/users/signup`;
const urlLogout = `/api/v1/users/logout`;

const urlForgotPassword = `/api/v1/users/forgotPassword`;
const urlResetPassword = `/api/v1/users/resetPassword`;

const urlUserInfo = `/api/v1/users/me`;
const urlUserReadingList = `/api/v1/users/readingList`;

const urlUserFollowing = `/api/v1/users/following`;
const urlUserFollowingAndFollowers = `/api/v1/users/followingAndFollowers`;
const urlContact = `/api/v1/users/contact`;

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

export function getUserReadingList() {
   return axios.get(urlUserReadingList);
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

// Get Current USER FOLLOWING list
export function getUserFollowing() {
   return axios.get(urlUserFollowing);
}
// Get Current USER Following and Followers list with populated
export function getUserFollowingAndFollowers() {
   return axios.get(urlUserFollowingAndFollowers);
}
// USER FOLLOW Action
export function postUserFollowService(userId) {
   //console.log(userId)
   return axios.post(`/api/v1/users/${userId}/follow`);
}
// Contact Form Submit
export function postContactService(data) {
   return axios.post(urlContact, data);
}