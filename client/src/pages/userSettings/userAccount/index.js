import React from 'react';

import UpdateUserPassword from './../../../components/UpdateUserPassword'
import { IsoToDateWithDay, IsoToDateWithDayAndTime } from './../../../utils/IsoDateConvert';

const UserAccount = ({ currentUser }) => {
   const { email, createdAt, updatedAt, role, passwordChangedAt } = currentUser;

   return (
      <div>
         <div className="ui  floating message blue">
            <div className="header">
               <i className=" thumbtack icon"></i>
            Update Password
            </div>

         </div>

         <UpdateUserPassword />

         <div className="ui  floating message blue">
            <div className="header">
               <i className=" thumbtack icon"></i>
            Account Details
            </div>

         </div>

         <div className="ui raised segment blue">
            <div className="ui divided selection list">
               <span className="item">
                  <div className="ui blue horizontal label">Primary Email</div>
                  {email}
               </span>
               <span className="item">
                  <div className="ui blue horizontal label">Role</div>
                  {role.toUpperCase()}
               </span>
               <span className="item">
                  <div className="ui blue horizontal label">Account Created On</div>
                  {IsoToDateWithDay(createdAt)}
               </span>
               <span className="item">
                  <div className="ui blue horizontal label">Profile Last Updated On</div>
                  {IsoToDateWithDay(updatedAt)}
               </span>

               <span className="item">
                  <div className="ui blue horizontal label">Password Last Changed On</div>
                  {(passwordChangedAt && IsoToDateWithDayAndTime(passwordChangedAt)) || 'Not changed yet.'}
               </span>
            </div>
         </div>

         <div className="ui floating message red">
            <div className="header">
               <i className="thumbtack icon"></i>
            Delete Account
         </div>
         </div>

         <div className="ui raised segment red">
            <div className="ui bulleted list">
               <div className="item">Delete your profile, along with your authentication associations. This does not include applications permissions. You will have to remove them yourself.</div>
               <div className="item">Delete any and all content you have, such as articles, comments, your reading list or chat messages.</div>
               <div className="item">Allow your username to become available to anyone.</div>
            </div>
            <div className="ui animated button negative" tabIndex="0">
               <div className="visible content">Delete Account</div>
               <div className="hidden content">
                  <i className="trash icon"></i>
               </div>
            </div>
         </div>
      </div>
   )
}

export default UserAccount;

