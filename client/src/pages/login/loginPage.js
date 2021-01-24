import React, { useState, useRef } from 'react'
import { Segment, Grid, Button, Form, Icon, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import MessageBox from './../../components/messageBox';
import formStyle from './../../common/formStyles';

const LoginPage = ({ userMessage, login, forgotPassword, isFetching }) => {

   let mtype = null
   let mfor = null
   if (userMessage) {
      if (userMessage.hasOwnProperty('type')) {
         mtype = userMessage.type;
      }
      mfor = userMessage.for;
   }

   const { register, handleSubmit, errors, reset, clearErrors } = useForm({ mode: 'onChange' });

   const [forgotPasswordForm, setForgotPasswordForm] = useState(false);
   const inputForgotPasswordRef = useRef(null);

   const onLoginSubmit = (data) => {
      const { email, password } = data;
      console.log(data)
      try {
         login(email, password)
      } catch (error) {
         console.log(error.message)
      }
   };
   const onForgotPasswordSubmit = (e) => {
      e.preventDefault();
      const forgotPasswordEmail = inputForgotPasswordRef.current.value;
      try {
         forgotPassword(forgotPasswordEmail)
      } catch (error) {
         console.log(error.message)
      }
   }

   return (

      <Grid textAlign='center' style={formStyle.grid} verticalAlign='middle'>
         <Grid.Column style={formStyle.gridColumn}>

            <img style={formStyle.img} alt="logo" src='/images/logoCLsvgBlack.svg' />
            <Message
               floating
               header='Welcome back to Coders League!'
               content='Fill out the form below to Login.'
            />
            <Segment raised padded  >

               <Form
                  style={formStyle.align}
                  onSubmit={handleSubmit(onLoginSubmit)}
                  error={mfor === 'login' && mtype === 'error'}
                  success={mfor === 'login' && mtype === 'success'}
               >
                  <Form.Field error={!!errors.email} required>
                     <label htmlFor="login-email">Email</label>
                     <div className="ui left icon input">
                        <i className="mail icon"></i>
                        <input
                           id="login-email"
                           name="email"
                           type="email"
                           placeholder="johnDoe@gmail.com"
                           ref={register({
                              required: "You must specify an email.",
                              pattern: {
                                 value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
                                 message: "Your email must be valid."
                              }
                           })}
                        />
                     </div>
                     {errors.email && <span style={formStyle.errorMessage}>{errors.email.message}</span>}
                  </Form.Field>

                  <Form.Field error={!!errors.password} required>
                     <label htmlFor="login-password">Password</label>
                     <div className="ui left icon input">
                        <i className="lock icon"></i>
                        <input
                           id="login-password"
                           name="password"
                           type="password"
                           placeholder="*******"
                           ref={register({
                              required: "You must specify a password.",
                              minLength: {
                                 value: 6,
                                 message: "Your password must be greater than 5 characters."
                              }
                           })}
                        />
                     </div>
                     {errors.password && <span style={formStyle.errorMessage}>{errors.password.message}</span>}
                  </Form.Field>

                  {mfor === 'login' && mtype && <MessageBox message={userMessage} dispatchFor='user' />}

                  <Form.Button
                     style={formStyle.formButton}
                     color="blue"
                     content='Submit'
                     loading={isFetching && mfor === 'login' ? true : false}
                     fluid
                  />
                  <button className="ui fluid button" type="button" onClick={() => reset() && clearErrors()}>Reset</button>
               </Form>
               <div className="ui horizontal divider">Or</div>
               <Button
                  as={'a'}
                  href="http://localhost:5000/auth/google"
                  icon="google"
                  content="Continue with Google"
                  color='google plus'
                  fluid
               />

               <Message warning style={formStyle.align}>
                  <Icon name='help' />
                  Don't have a account?&nbsp;<Link to='/signup'><span style={formStyle.boldLink}>Signup here</span></Link>&nbsp;instead.
                  <br />
                  <Icon name="help" />
                  Forgot password?&nbsp;
                  <span
                     onClick={() => setForgotPasswordForm(!forgotPasswordForm)}
                     style={formStyle.boldLink}
                  >
                     Reset Password
                  </span>
               </Message>

               {forgotPasswordForm ? (
                  <Form
                     style={formStyle.align}
                     className="segment"
                     onSubmit={onForgotPasswordSubmit}
                     error={mfor === 'forgotPassword' && mtype === 'error'}
                     success={mfor === 'forgotPassword' && mtype === 'success'}
                  >
                     <Form.Field required >
                        <label htmlFor="forgotPasswordEmail">Email</label>
                        <div className="ui left icon input">
                           <i className="envelope icon"></i>
                           <input
                              id='forgotPasswordEmail'
                              placeholder='johnDoe@gmail.com'
                              type='email'
                              name="emailForgotPassword"
                              ref={inputForgotPasswordRef}
                           />
                        </div>
                     </Form.Field>

                     {mfor === 'forgotPassword' && mtype && <MessageBox message={userMessage} dispatchFor='user' />}

                     <Form.Button
                        style={formStyle.formButton}
                        content='Send'
                        loading={isFetching && mfor === 'forgotPassword' ? true : false}
                        fluid
                     />
                  </Form>
               ) : null}

            </Segment>
         </Grid.Column>
      </Grid>
   )
}

export default LoginPage;

