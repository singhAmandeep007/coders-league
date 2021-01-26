const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');


const signToken = id => {
   // encoding user id
   return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
   });
}

const createSendToken = (user, statusCode, res) => {
   const token = signToken(user._id);

   const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),// in days
      httpOnly: true, //A cookie with the HttpOnly attribute is inaccessible to the JavaScript Document.cookie API; it is sent only to the server.This precaution helps mitigate cross-site scripting (XSS) attacks.
   }
   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
   //res.cookie Sets cookie name to value. The value parameter may be a string or object converted to JSON.
   res.cookie('jwt', token, cookieOptions);
   // remove password from output
   user.password = undefined;

   return res.status(statusCode).json({
      status: 'success',
      token,
      data: {
         user
      }
   });
}

exports.signup = catchAsync(async (req, res, next) => {
   console.log(req.body)
   const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      //passwordChangedAt: req.body.passwordChangedAt,
   });
   const url = `${req.protocol}://${req.get('host')}/settings/profile`;
   //console.log(url);
   await new Email(newUser, url).sendWelcome()
   createSendToken(newUser, 201, res);

});

exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;

   if (!email || !password) {
      // return new created error if any of these is false, 400 = bad request
      return next(new AppError('Please provide email and password!', 400))
   }

   const user = await User.findOne({ email: email }).select('+password');
   //console.log('user:', user);

   if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password!', 401))
   }

   createSendToken(user, 200, res);
})

exports.signInSocial = catchAsync(async (req, res, next) => {
   // console.log(req.user)
   if (!req.user) {
      return res.send(401, 'User Not Authenticated');
   }
   // generate token
   const token = signToken(req.user._id);

   const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),//90days
      httpOnly: true, //A cookie with the HttpOnly attribute is inaccessible to the JavaScript Document.cookie API; it is sent only to the server.This precaution helps mitigate cross-site scripting (XSS) attacks.
   }
   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

   //res.cookie Sets cookie name to value. The value parameter may be a string or object converted to JSON.
   res.cookie('jwt', token, cookieOptions);
   res.cookie('signedInWith', 'social')
   // remove password from output
   req.user.password = undefined;
   res.redirect('/');
});

exports.logout = (req, res) => {
   // setting a dummy cookie value which expires in 10seconds from current date
   res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),// 10 seconds
      httpOnly: true
   })
   // res.cookie('signedinWith', "loggedout")
   if (req.logout) req.logout();
   res.status(200).json({ status: 'success' })
}

// middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
   let token;
   // 1) getting the token and check of it's there

   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // reading jwt from authorization header 
      token = req.headers.authorization.split(' ')[1];
   } else if (req.cookies.jwt) {
      // reading jwt from a cookie using cookieParser. 
      // if it exists then token is exactly that. Now we can also authenticate users by the jwt send via cookies.
      console.log('jwt recieved via cookie:', req.cookies.jwt)
      token = req.cookies.jwt;
   }

   // fixed
   if (typeof token === 'undefined') {
      return next(new AppError('You are not logged in! Please login to get access.', 401));
   }
   // 2) decoding the token to extract the user.id  .The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   //console.log(decoded);
   // 3) check if user still exits
   const currentUser = await User.findById(decoded.id);
   if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist. Please Signup!', 401))
   }
   // 4) check if user changed password after the JWT was issued
   if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password! Please login again.', 401))
   };
   // put current user on req obj and Grant Access to protected routes
   req.user = currentUser;
   next();
})

exports.restrictTo = (...roles) => {
   // return new middware fn
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(new AppError('You do not have permission to perform this action', 403))
      }
      return next();
   }
}


exports.forgotPassword = catchAsync(async (req, res, next) => {
   //1) get user with req.body.email in DB where google id doesn't exist
   const user = await User.findOne({ email: req.body.email, googleId: { "$exists": false } });
   if (!user) {
      return next(new AppError('No user with this email address or account registered with googleId!', 404));
   }
   //2) generate random reset token 
   const resetToken = user.createPasswordResetToken();
   // deactivate all the validators specified in schema before saving the doc.
   await user.save({ validateBeforeSave: false });

   //3) send it to user email
   try {
      const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
      // sendEmail returns a promise
      await new Email(user, resetURL).sendPasswordReset();
      res.status(200).json({
         status: 'success',
         message: 'Token sent to email!'
      })
   } catch (err) {
      // if any error appears in sending email do this.
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Error sending the email. Try again later!', 500))
   }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
   //1) get user based on token 
   // console.log(req.body)
   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
   const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

   //2) set new password only if token is not expired
   if (!user) {
      return next(new AppError('Token is invalid or has expired!', 400))
   }
   // console.log(user)
   // else do these necessary steps
   user.password = req.body.password;
   user.passwordConfirm = req.body.passwordConfirm;
   user.passwordResetExpires = undefined;
   user.passwordResetToken = undefined;

   //3) update passwordChangedAt property for current user
   // this will be done in pre save hook in user model
   await user.save();

   //4) finally login user by issuing new jwt
   createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
   // console.log(req.body)
   // 1) get user from the collection along with password
   const user = await User.findOne({ _id: req.user.id, googleId: { "$exists": false } }).select('+password');
   // 2) check if POSTed current password  is correct
   if (!user) {
      return next(new AppError('Not allowed as account is registered with googleId.', 404));
   }
   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong!', 401))
   }
   // 3) if yes update password 
   user.password = req.body.password;
   user.passwordConfirm = req.body.passwordConfirm;
   // we want the validation to happen
   await user.save(); // this will not work in findAndUpdate
   // 4) Log user in , send new JWT
   createSendToken(user, 200, res);
}) 