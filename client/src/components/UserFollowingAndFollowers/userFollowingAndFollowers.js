import React from 'react';

import { getUserFollowingAndFollowers } from './../../services/userApi';

const UserFollowingAndFollowers = () => {
   return (
      <div>
         {/* case "GET_USER_FOLLOWING":
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
         } */}
      </div>
   )
}

export default UserFollowingAndFollowers;
