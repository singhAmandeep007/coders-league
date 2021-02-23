import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getUserFollowingAndFollowers } from './../../services/userApi';

import PlaceholderComment from './../placeholderComment/placeholderComment';
import UserFollowing from './userFollowing';
import UserFollowers from './userFollowers';

const UserFollowingAndFollowers = () => {

   let history = useHistory();
   const [state, setState] = useState({
      followingData: null,
      followersData: null,
      loading: true
   })

   const unfollowUser = (userId) => {
      setState({
         ...state,
         followingData: state.followingData.filter(following => following._id !== userId)
      })
   }

   useEffect(() => {
      getUserFollowingAndFollowers().then(response => {
         //console.log(response.data)
         setState({
            followingData: response.data.data.following,
            followersData: response.data.data.followers,
            loading: false
         })

      }, err => history.push('/error'))
   }, [history])

   return (
      <>
         {state.loading ? <PlaceholderComment /> : <>
            <UserFollowing
               followingData={state.followingData}
               unfollowUser={(userId) => unfollowUser(userId)}
            />
            <br /><br />
            <UserFollowers followersData={state.followersData} /></>}
      </>
   )
}

export default UserFollowingAndFollowers;
