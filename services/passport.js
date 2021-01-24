// var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth20').Strategy;

// const User = require('./../models/userModel');
// const Email = require('./../utils/email');

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/auth/google/callback',
//       // for heroku proxy
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // const { id, email, given_name, family_name, picture } = profile._json;
//         // console.log('profile:', profile)
//         const existingUser = await User.findOne({
//           $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
//         });

//         if (existingUser) {
//           // console.log('existingUser', existingUser)
//           // first arg is error and second is user obj
//           done(null, existingUser);
//         } else {
//           const newUser = await new User({
//             googleId: profile.id,
//             username: profile.name.givenName,
//             fullname: profile.displayName,
//             email: profile.emails[0].value,
//             photo: profile.photos[0].value
//           }).save({ validateBeforeSave: false });
//           // console.log('newUser', newUser)
//           // NEED TO CHANGE FOR PROD ENV
//           let url;
//           if (process.env.NODE_ENV === 'development') {
//             url = `http://localhost:3000/me`;
//           }
//           //console.log(url);
//           await new Email(newUser, url).sendWelcome();

//           done(null, newUser);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   )
// );
