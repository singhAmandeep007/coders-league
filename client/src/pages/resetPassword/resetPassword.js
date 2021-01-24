import React, { useRef } from "react";
import { Segment, Grid, Form, Icon, Message } from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import MessageBox from './../../components/messageBox';
import formStyle from './../../common/formStyles';

const ResetPasswordPage = ({ resetPassword, isFetching, userMessage }) => {

   const { register, handleSubmit, errors, watch, reset, clearErrors } = useForm({ mode: 'onChange' });
   const password = useRef({});
   password.current = watch("password", "");

   let { resetToken } = useParams();

   let mtype = null
   let mfor = null
   if (userMessage) {
      if (userMessage.hasOwnProperty('type')) {
         mtype = userMessage.type;
      }
      mfor = userMessage.for;
   }


   const onResetPasswordSubmit = (data) => {
      const { password, passwordConfirm } = data;
      console.log(data)
      try {
         resetPassword(resetToken, password, passwordConfirm)
      } catch (error) {
         console.log(error.message)
      }
   };

   return (
      <Grid textAlign='center' style={formStyle.grid} verticalAlign='middle'>
         <Grid.Column style={formStyle.gridColumn}>

            <Segment raised padded  >
               <img style={formStyle.img} alt="logo" src='/images/logo.png' />
               <Message
                  floating
                  header='Reset Password!'
                  content='Fill out the form below to reset your password.'
               />

               <Form
                  style={formStyle.align}
                  onSubmit={handleSubmit(onResetPasswordSubmit)}
                  error={mfor === 'resetPassword' && mtype === 'error'}
                  success={mfor === 'resetPassword' && mtype === 'success'}
               >
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
                              required: "You must specify a password",
                              minLength: {
                                 value: 5,
                                 message: "Password must have at least 5 characters"
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
                              required: "You must confirm your password",
                              validate: value =>
                                 value === password.current || "The passwords do not match"
                           })}
                        />
                     </div>
                     {errors.passwordConfirm && (<span style={formStyle.errorMessage}>{errors.passwordConfirm.message}</span>)}
                  </Form.Field>


                  {mfor === 'resetPassword' && mtype && <MessageBox message={userMessage} dispatchFor='user' />}


                  <Form.Button
                     style={formStyle.formButton}
                     color="blue"
                     content='Submit'
                     loading={isFetching && mfor === 'resetPassword' ? true : false}
                     fluid
                  />
                  <button className="ui fluid button" type="button" onClick={() => reset() && clearErrors()}>Reset</button>
               </Form>

               <Message warning style={formStyle.align}>
                  <Icon name='help' />
                  Don't have a account?&nbsp;<Link to='/signup'><span style={formStyle.boldLink}>Signup here</span></Link>&nbsp;instead.
                  <br />
                  <Icon name="help" />
                  Resend Password Reset Email or Login?&nbsp;<Link to='/login'><span style={formStyle.boldLink}>Click here</span></Link>&nbsp;
               </Message>

            </Segment>
         </Grid.Column>
      </Grid>
   );
}
export default ResetPasswordPage;

