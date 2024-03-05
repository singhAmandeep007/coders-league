const Article = require("./../models/articleModel");
const ArticleLike = require("./../models/articleLikeModel");
const ArticleBookmark = require("./../models/articleBookmarkModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
//const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopFiveArticle = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-likeCounts,-commentCounts";
  req.query.fields = "title , body, likeCounts , commentCounts, tags , expertiseLevel";
  next();
};

exports.setQuery = (req, res, next) => {
  // req.query.limit = '5';
  // req.query.sort = '-createdAt';
  req.query.fields = "-body -image -images";
  next();
};
// assign the user id to the article document so that later we could check its ownership
exports.setUserId = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

exports.checkOwnershipAndUpdate = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id, user: req.user.id };
  // can be filtered what can be updated
  const update = { ...req.body };

  const article = await Article.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
  });

  if (!article) {
    return next(new AppError("No Article found with that ID or You are not authorised to perform this action.", 404));
  }
  // to trigger slugify of title
  await article.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: "success",
    data: article,
  });
});

exports.checkOwnershipAndDelete = catchAsync(async (req, res, next) => {
  // allow admin to delete an any model
  let filter = { _id: req.params.id };
  if (req.user.role !== "admin") {
    filter["user"] = req.user.id;
  }

  // can be filtered what can be updated

  const article = await Article.findOneAndDelete(filter);

  if (!article) {
    return next(new AppError("No Article found with that ID or You are not authorised to perform this action.", 404));
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.setArticleLike = async (req, res, next) => {
  try {
    let doc = await Article.findById(req.params.articleId);
    if (!doc) {
      return next(new AppError("No Article found with that ID", 404));
    }
    // updateOne
    let articleTobeLiked = await ArticleLike.updateOne(
      {
        article: req.params.articleId,
        users: { $ne: req.user.id },
      },
      {
        $addToSet: { users: req.user.id },
      }
    );

    if (articleTobeLiked.nModified === 1) {
      //1 means, modification, that means its liked
      return res.status(200).json({
        status: "success",
        data: "successfully liked article",
      });
    } else if (articleTobeLiked.nModified === 0) {
      await ArticleLike.updateOne(
        { article: req.params.articleId },
        {
          $pull: { users: req.user.id },
        }
      );

      return res.status(200).json({
        status: "success",
        data: "successfully unliked article",
      });
    }
    return next(new AppError("Some error occured!", 403));
  } catch (err) {
    next(err);
  }
};

exports.setArticleBookmark = async (req, res, next) => {
  try {
    let doc = await Article.findById({ _id: req.params.articleId });
    if (!doc) {
      return next(new AppError("No Article found with that ID", 404));
    }

    // updateOne
    let articleTobeBookmarked = await ArticleBookmark.updateOne(
      {
        article: req.params.articleId,
        users: { $ne: req.user.id },
      },
      {
        $addToSet: { users: req.user.id },
      }
    );

    if (articleTobeBookmarked.nModified === 1) {
      //1 means, modification, that means its bookmarked
      return res.status(200).json({
        status: "success",
        data: "successfully bookmarked article",
      });
    } else if (articleTobeBookmarked.nModified === 0) {
      await ArticleBookmark.updateOne(
        { article: req.params.articleId },
        {
          $pull: { users: req.user.id },
        }
      );

      return res.status(200).json({
        status: "success",
        data: "successfully unbookmarked article",
      });
    }
    return next(new AppError("Some error occured!", 403));
  } catch (err) {
    next(err);
  }
};

exports.getTopArticles = (daysLess, limit) => {
  return async (req, res, next) => {
    const articles = await Article.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - daysLess)),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $sort: { likeCounts: -1, commentCounts: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          "user._id": 1,
          "user.fullname": 1,
          "user.username": 1,
          "user.photo": 1,
          title: 1,
          shortDescription: 1,
          readingTime: 1,
          slug: 1,
          image: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      results: articles.length,
      data: {
        articles,
      },
    });
  };
};

exports.getAllArticles = factory.getAll(Article, {
  path: "user",
  select: "username fullname photo",
});
// we pass the populate in this as we need all the comments filled up for that particular article we are trying to retrieve , we could also specify select, etc.
//, [{ path: 'user', select: "username fullname photo location createdAt" }, { path: 'comments' }])
exports.getArticle = factory.getOne(Article);
exports.createArticle = factory.createOne(Article);
// exports.updateArticle = factory.updateOne(Article, true);
// exports.deleteArticle = factory.deleteOne(Article);
