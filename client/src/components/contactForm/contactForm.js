import React, { useRef, useState } from 'react';

import { helpFormOptions } from './../../common/dropdownOptions';
import { postContactService } from './../../services/userApi';

const ContactForm = ({ type, currentUser }) => {

   const nameRef = useRef('');;
   const emailRef = useRef('');
   const subjectRef = useRef('')
   const messageRef = useRef('')

   const [state, setState] = useState({
      isLoading: false,
      message: null,
      error: null
   })

   const handleSubmit = async (e) => {
      e.preventDefault();
      let subject = subjectRef.current.value;
      let message = messageRef.current.value;

      if (message.length < 10) {
         setState({ ...state, message: null, error: 'Please describe briefly.' })
         return;
      }
      let formData = {
         fullname: currentUser.fullname,
         userEmail: currentUser.email,
         subject,
         message
      }
      try {
         setState({ error: null, message: null, isLoading: true });
         const response = await postContactService(formData);
         if (response.status === 200) {
            subject = 'Feedback';
            message = '';
            setState({ isLoading: false, error: null, message: 'Ticket Sent Successfully.' })
            return;
         }
         else {
            setState({ ...state, isLoading: false, error: 'Failed to send.' })
            return;
         }
      }
      catch (error) {
         const { response } = error;
         setState({ ...state, isLoading: false, error: response.data.message || error.message })
         return;
      }
   }

   return (

      <form
         id="contact-form"
         className={`ui form ${state.message ? 'success' : state.error ? 'error' : ''} `}
         style={{ maxWidth: 450, }}
         onSubmit={(e) => handleSubmit(e)}

      >
         <div className="ui basic segment">
            {!type === 'help' && <div className="field">
               <label><i className="user icon"></i>Name</label>
               <input
                  required
                  type="text"
                  name="name"
                  placeholder="Enter your Name"
                  ref={nameRef}
               />
            </div>}

            {!type === 'help' && <div className="field">
               <label><i className="mail icon"></i> Email</label>
               <input
                  required
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  ref={emailRef}
               />
            </div>}

            <div className="field">
               <label><i className="filter icon"></i> Subject</label>
               <select
                  className="ui fluid dropdown"
                  name="subject"
                  required
                  ref={subjectRef}
                  defaultValue={'Feedback'}
               >
                  {helpFormOptions.map((option) => {
                     return <option key={option.key} value={option.value}>{option.text}</option>
                  })}
               </select>
            </div>

            <div className="field">
               <label><i className="pencil alternate icon"></i> Message</label>
               <textarea
                  name="message"
                  placeholder="Please write your message here."
                  tabIndex="5"
                  required
                  ref={messageRef}
               ></textarea>
            </div>

            <div class="ui error tiny message">
               <p>{state.error}</p>
            </div>

            <div class="ui success tiny message">
               <p>{state.message}</p>
            </div>

            <button
               type="submit"
               className={`ui blue fluid button ${state.isLoading ? 'loading' : ''}`} tabIndex="0" form="contact-form">
               Submit
            </button>
         </div>
      </form>

   )
}

export default ContactForm
