const express = require('express');
const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');

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

module.exports = router; 