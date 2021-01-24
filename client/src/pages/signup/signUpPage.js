import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Segment, Grid, Form, Icon, Message, Button } from 'semantic-ui-react';

import { signup } from './../../redux/user/userActions';
import MessageBox from './../../components/messageBox'
import formStyle from './../../common/formStyles';

const SignUpPage = ({ userMessage, signup, isFetching }) => {

   const [visible, setVisible] = useState(false);

   const { register, handleSubmit, errors, watch, reset, clearErrors } = useForm({ mode: 'onChange' });

   const password = useRef({})
   password.current = watch("password", "");

   let mtype = null
   let mfor = null
   if (userMessage) {
      if (userMessage.hasOwnProperty('type')) {
         mtype = userMessage.type;
      }
      mfor = userMessage.for;
   }

   const onSubmit = (data) => {
      const { username, email, password, passwordConfirm } = data;
      console.log(data)
      try {
         signup(username, email, password, passwordConfirm);
      } catch (error) {
         console.log(error.message);
      }
   };

   return (
      <Grid textAlign='center' style={formStyle.grid} verticalAlign='middle'>
         <Grid.Column style={formStyle.gridColumn}>
            <img style={formStyle.img} alt="logo" src='/images/logoCLsvgBlack.svg' />
            <Message
               floating
               header='Welcome to Coders League!'
               content='Fill out the form or sign up with google to join us🚀.'
            />
            <Segment raised padded  >
               <Button
                  onClick={() => setVisible(!visible)}
                  toggle
                  active={!visible}
                  content="Sign up with Email and password"
                  fluid
                  icon='signup'
                  style={{ marginBottom: '10px' }}
               />
               <Form
                  className={visible ? '' : 'hiddenCustom'}
                  style={formStyle.align}
                  onSubmit={handleSubmit(onSubmit)}
                  error={mfor === 'signup' && mtype === 'error'}
                  success={mfor === 'signup' && mtype === 'success'}
               >

                  <Form.Field error={!!errors.username} required>
                     <label htmlFor="signup-name">User Name</label>
                     <div className="ui left icon input">
                        <i className="user icon"></i>
                        <input
                           id='signup-name'
                           name="username"
                           type="text"
                           placeholder="JohnDoe"
                           ref={register({
                              required: "You must specify a username",
                              minLength: {
                                 value: 5,
                                 message: "Your username must be greater than or equal to 5 characters."
                              },
                              pattern: {
                                 // no space at all ->  /^\S+$/ no space in between characters -> /^\s*\S+\s*$/
                                 value: /^\s*\S+\s*$/,
                                 message: 'Your username must not contain spaces.'
                              }
                           })}
                        />
                     </div>
                     {errors.username && <span style={formStyle.errorMessage}>{errors.username.message}</span>}
                  </Form.Field>
                  <Form.Field error={!!errors.email} required>
                     <label htmlFor="signup-email">Email</label>
                     <div className="ui left icon input">
                        <i className="mail icon"></i>
                        <input
                           id='signup-email'
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
                     <label htmlFor="signup-password">Password</label>
                     <div className="ui left icon input">
                        <i className="lock icon"></i>
                        <input
                           id='signup-password'
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
                  <Form.Field error={!!errors.passwordConfirm} required>
                     <label htmlFor="signup-passwordConfirm">Confirm Password</label>
                     <div className="ui left icon input">
                        <i className="lock icon"></i>
                        <input
                           id="signup-passwordConfirm"
                           name="passwordConfirm"
                           type="password"
                           placeholder="*******"
                           ref={register({
                              required: "You must confirm your password",
                              validate: value =>
                                 value === password.current || "The passwords do not match!"
                           })}
                        />
                     </div>
                     {errors.passwordConfirm && (<span style={formStyle.errorMessage}>{errors.passwordConfirm.message}</span>)}
                  </Form.Field>

                  {mfor === 'signup' && mtype && <MessageBox message={userMessage} dispatchFor="user" />}

                  <Form.Button
                     style={formStyle.formButton}
                     color='blue'
                     content="Submit"
                     loading={isFetching && mfor === 'signup' ? true : false}
                     fluid
                  />
                  <button className="ui fluid button" type="button" onClick={() => reset() && clearErrors()}>Reset</button>
               </Form>
               <div className="ui horizontal divider">Or</div>
               <Button
                  as={'a'}
                  href="http://localhost:5000/auth/google"
                  icon="google"
                  content="Sign up with Google"
                  color='google plus'
                  fluid
               />
               <Message warning style={formStyle.align}>
                  <Icon name='help' />
                  Already signed up?&nbsp;<Link to='/login'><span style={formStyle.boldLink}>Login here</span></Link>&nbsp;instead.
               </Message>
            </Segment>
         </Grid.Column>
      </Grid>
   )
}

const mapStateToProps = state => {
   return {
      isFetching: state.userReducer.isFetching,
      userMessage: state.userReducer.userMessage
   }
}
const mapDispatchToProps = dispatch => ({
   signup: (username, email, password, passwordConfirm) => {
      dispatch(signup(username, email, password, passwordConfirm));
   }
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
