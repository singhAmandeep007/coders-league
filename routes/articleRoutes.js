const express = require('express');

const articleController = require('./../controllers/articleController');
const authController = require('./../controllers/authController');

const commentRouter = require('./../routes/commentRoutes');

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


module.exports = router;