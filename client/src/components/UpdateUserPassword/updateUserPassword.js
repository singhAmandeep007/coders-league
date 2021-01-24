import React, { useRef } from "react";
import { Segment, Form } from 'semantic-ui-react';

import { useForm } from 'react-hook-form';

import MessageBox from './../messageBox';
import formStyle from './../../common/formStyles';

const UpdateUserPassword = ({ updatePassword, isFetching, userMessage }) => {

   const { register, handleSubmit, errors, watch, reset, clearErrors } = useForm({ mode: 'onChange' });
   const password = useRef({});
   password.current = watch("password", "");

   let mtype = null
   let mfor = null
   if (userMessage) {
      if (userMessage.hasOwnProperty('type')) {
         mtype = userMessage.type;
      }
      mfor = userMessage.for;
   }

   const onUpdatePasswordSubmit = (data) => {
      console.log(data)
      try {
         updatePassword(data)
      } catch (error) {
         console.log(error.message)
      }
   };

   return (

      <Segment color='blue' raised>
         <Form
            // style={formStyle.align}
            onSubmit={handleSubmit(onUpdatePasswordSubmit)}
            error={mfor === 'updatePassword' && mtype === 'error'}
            success={mfor === 'updatePassword' && mtype === 'success'}
         >
            <Form.Field error={!!errors.passwordCurrent} required>
               <label htmlFor="passwordCurrent">Current Password</label>
               <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                     id="passwordCurrent"
                     name="passwordCurrent"
                     type="password"
                     placeholder="******"
                     ref={register({
                        required: "You must specify a password.",
                        minLength: {
                           value: 5,
                           message: "Password must have at least 5 characters."
                        }
                     })}
                  />
               </div>
               {errors.passwordCurrent && <span style={formStyle.errorMessage}>{errors.passwordCurrent.message}</span>}
            </Form.Field>
            <Form.Field error={!!errors.password} required>
               <label htmlFor="password">New Password</label>
               <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                     id="password"
                     name="password"
                     type="password"
                     placeholder="******"
                     ref={register({
                        required: "You must specify a password.",
                        minLength: {
                           value: 5,
                           message: "Password must have at least 5 characters."
                        }
                     })}
                  />
               </div>
               {errors.password && <span style={formStyle.errorMessage}>{errors.password.message}</span>}
            </Form.Field>
            <Form.Field error={!!errors.passwordConfirm} required>
               <label htmlFor="passwordConfirm">Confirm New Password</label>
               <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input
                     id="passwordConfirm"
                     name="passwordConfirm"
                     type="password"
                     placeholder="******"
                     ref={register({
                        required: "You must confirm your password.",
                        validate: value =>
                           value === password.current || "The passwords do not match!"
                     })}
                  />
               </div>
               {errors.passwordConfirm && (<span style={formStyle.errorMessage}>{errors.passwordConfirm.message}</span>)}
            </Form.Field>


            {mfor === 'updatePassword' && mtype && <MessageBox message={userMessage} dispatchFor='user' />}


            <Form.Button
               style={formStyle.formButton}
               color="blue"
               content='Submit'
               loading={isFetching && mfor === 'updatePassword' ? true : false}
               fluid
            />
            <button className="ui fluid button" type="button" onClick={() => reset() && clearErrors()}>Reset</button>
         </Form>
      </Segment>

   );
}
export default UpdateUserPassword;

