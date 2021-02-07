const express = require('express');
// const rateLimit = require("express-rate-limit");

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// const createLimiter = rateLimit({
//    windowMs: 60 * 60 * 1000, // 1 hour window
//    max: 20, // start blocking after 10 requests
//    message:
//       "📢 Too many Follow from this IP, Try again after 1 hour!"
// });

// /api/v1/users

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/profile/:username', userController.getUserProfile);

// Protected Routes
router.use(authController.protect);

router.patch('/updatePassword',
   authController.updatePassword);

router.get('/me',
   userController.getMe,
   userController.getUser);

// /api/v1/users
router.get('/readingList',
   userController.getUserReadingList);

router.patch('/updateMe',
   userController.uploadUserPhoto,
   userController.updateMe);

router.delete('/deleteMe',
   userController.deleteMe);

// GET FOLLOWING USERS
router.get('/following',
   userController.getFollowing)
router.get('/followingAndFollowers',
   userController.getFollowingAndFollowers)


// /api/v1/users/5fc508915eeed324b8ade5e1/follow
router.route('/:userId/follow')
   .post(
      authController.restrictTo('user'),
      userController.setUserFollow
   )

router.route('/contact')
   .post(
      userController.handleContact
   )


// Restricted Routes --> ADMIN
router.use(authController.restrictTo('admin'));

router.route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser);

router.route('/:id')
   .get(userController.getUser)
   .patch(userController.updateUser)
   .delete(userController.deleteUser);

module.exports = router;