const express = require('express');
const rateLimit = require("express-rate-limit");

const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');

const createLikeLimiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 1 hour window
   max: 10, // start blocking after 10 requests
   message:
      "📢 Too many Likes from this IP, Try again after 1 hour!"
});

// for this route /api/v1/article/:articleId/comments
const router = express.Router({ mergeParams: true });

// /api/v1/comments
router.use(authController.protect);

//   /comments/
//  /articles/5fc508915eeed324b8ade5e1/comments

router.route('/')
   .get(commentController.getAllComments)
   .post(
      authController.restrictTo('user'),
      commentController.setArticleUserIds,
      commentController.createComment
   )

//  /articles/5fc508915eeed324b8ade5e1/comments/5fc4823570f93040a0931889

router.route('/:id')
   .get(commentController.getComment)
   .patch(
      authController.restrictTo('user', 'admin'),
      commentController.checkOwnershipAndUpdate
   )
   .delete(
      authController.restrictTo('user', 'admin'),
      commentController.checkOwnershipAndDelete
   )

//  /api/v1/comments/5fc508915eeed324b8ade5e1/like/ 
router.route('/:commentId/like')
   .post(
      createLikeLimiter,
      authController.restrictTo('user'),
      commentController.setCommentLike
   )
module.exports = router; 