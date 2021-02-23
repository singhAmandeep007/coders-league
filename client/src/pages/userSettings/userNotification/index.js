import React, { useState } from 'react';

import { updateUserService } from './../../../services/userApi';
import { updateUserInfo } from './../../../redux/user/userActions';

export default function UserNotification({ emailNotification }) {

   const [state, setState] = useState({
      isTopArticleNotificationOn: emailNotification.topArticles,
      isTipsNotificationOn: emailNotification.tips,
      isFetching: false,
      message: '',
      error: null
   })

   const handleChange = (e) => {
      const name = e.target.name;
      // const checked = e.target.checked;
      setState({
         ...state,
         [name]: !state[name]
      })
   }

   const handleSave = async () => {
      setState({
         ...state,
         isFetching: true
      })
      try {
         const response = await updateUserService({
            emailNotification: {
               topArticles: state.isTopArticleNotificationOn,
               tips: state.isTipsNotificationOn
            }
         })
         if (response.status === 200) {
            //console.log(response.data.data.user)
            updateUserInfo(response.data.data.user)
            setState({
               ...state,
               isFetching: false
            })
         }
      } catch (error) {
         const { response } = error;
         const { request, ...errorObject } = response;
         setState({
            ...state,
            isFetching: false,
            error: errorObject.data.message
         })
      }
   }

   return (
      <div style={{ width: '100%' }}>
         <div className="ui icon blue small message">
            <i className="thumbtack icon" ></i>
            <div className="content" >
               <div className="header" >
                  Email Notifications
               </div>
               <p>Additional settings will be rolled out as new notification features are made available.</p>
            </div>
         </div>
         <div className="ui raised segment">
            <div className="ui slider checkbox">
               <input
                  type="checkbox"
                  name="isTopArticleNotificationOn"
                  checked={state.isTopArticleNotificationOn}
                  onChange={handleChange}
               />
               <label>Send me a weekly digest of top Articles from CodersLeague.</label>
            </div>
            <br /><br />
            <div className="ui slider checkbox">
               <input
                  type="checkbox"
                  name="isTipsNotificationOn"
                  checked={state.isTipsNotificationOn}
                  onChange={handleChange}
               />
               <label>Send me occasional tips on how to enhance my CodersLeague Community experience.</label>
            </div>

            {state.error ? <div className="ui red message">{state.error}</div> : null}

            <br /><br />
            <button className={`ui primary fluid button ${state.isFetching ? 'loading' : ''}`}
               onClick={() => handleSave()}
            >
               Save
            </button>
         </div>
      </div>

   )
}