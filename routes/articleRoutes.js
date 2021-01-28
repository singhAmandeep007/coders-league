const express = require('express');
const rateLimit = require("express-rate-limit");

const articleController = require('./../controllers/articleController');
const authController = require('./../controllers/authController');

const commentRouter = require('./../routes/commentRoutes');

const createLikeLimiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 1 hour window
   max: 20, // start blocking after 10 requests
   message:
      "📢 Too many Likes from this IP, Try again after 1 hour!"
});

const router = express.Router();

// /api/v1/articles

// redirect to comment route handlers
router.use('/:articleId/comments', commentRouter);

router.route('/top-5-article').get(
   articleController.aliasTopFiveArticle,
   articleController.getAllArticles
);

router.route('/')
   .get(articleController.setQuery, articleController.getAllArticles)
   .post(
      authController.protect,
      authController.restrictTo('user', 'admin'),
      articleController.setUserId,
      articleController.createArticle
   );

router.route('/:username/:slug')
   .get(articleController.getArticle)

router.route('/:id')
   .get(articleController.getArticle)
   .patch(
      authController.protect,
      authController.restrictTo('user', 'lead-moderator', 'admin'),
      articleController.checkOwnershipAndUpdate
   )
   .delete(
      authController.protect,
      authController.restrictTo('user', 'lead-moderator', 'admin'),
      articleController.checkOwnershipAndDelete
   );

//  /api/v1/articles/5fc508915eeed324b8ade5e1/like/ 
router.route('/:articleId/like')
   .post(
      createLikeLimiter,
      authController.protect,
      authController.restrictTo('user'),
      articleController.setArticleLike
   )

module.exports = router;