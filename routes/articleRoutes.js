const express = require('express');
const rateLimit = require("express-rate-limit");

const articleController = require('./../controllers/articleController');
const authController = require('./../controllers/authController');

const commentRouter = require('./../routes/commentRoutes');

const createLimiter = rateLimit({
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

router.route('/top/week').get(
   articleController.getTopArticles(7, 10)
);
router.route('/top/month').get(
   articleController.getTopArticles(30, 10)
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


router.use(authController.protect);
//  /api/v1/articles/5fc508915eeed324b8ade5e1/like
router.route('/:articleId/like')
   .post(
      createLimiter,
      authController.restrictTo('user'),
      articleController.setArticleLike
   )
//  /api/v1/articles/5fc508915eeed324b8ade5e1/bookmark
router.route('/:articleId/bookmark')
   .post(
      createLimiter,
      authController.restrictTo('user'),
      articleController.setArticleBookmark
   )

module.exports = router;