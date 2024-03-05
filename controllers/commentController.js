const Comment = require("../models/commentModel");
const CommentLike = require("../models/commentLikeModel");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.setArticleUserIds = (req, res, next) => {
  // console.log(req.params)
  if (req.params.articleId) {
    req.body.article = req.params.articleId;
    req.body.user = req.user.id;
    return next();
  }
  next(new AppError("Comment must be created on a article!", 401));
};

exports.checkOwnershipAndUpdate = catchAsync(async (req, res, next) => {
  // console.log(req.params)

  const filter = { _id: req.params.id, article: req.params.articleId, user: req.user.id };
  // can be filtered what can be updated
  const update = { ...req.body };

  const comment = await Comment.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    populate: { path: "commentLikes", select: "users -comment" },
  });
  if (!comment) {
    return next(
      new AppError("No Article or Comment found with that ID or You are not authorised to perform this action.", 404)
    );
  }
  return res.status(200).json({
    status: "success",
    data: comment,
  });
});

exports.checkOwnershipAndDelete = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id, article: req.params.articleId, user: req.user.id };
  // can be filtered what can be updated

  const comment = await Comment.findOneAndDelete(filter);
  // console.log(comment)

  if (!comment) {
    return next(
      new AppError("No Article or Comment found with that ID or You are not authorised to perform this action.", 404)
    );
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.setCommentLike = async (req, res, next) => {
  try {
    if (!req.params.commentId) {
      return next(new AppError("Comment Like must be created on a Comment!", 401));
    }

    let doc = await Comment.findById({ _id: req.params.commentId });
    if (!doc) {
      return next(new AppError("No Comment found with that ID", 404));
    }
    // find One and update
    let commentTobeLiked = await CommentLike.updateOne(
      {
        comment: req.params.commentId,
        users: { $ne: req.user.id },
      },
      {
        $addToSet: { users: req.user.id },
      }
    );

    if (commentTobeLiked.nModified === 1) {
      //1 means, modification, that means its liked
      return res.status(200).json({
        status: "success",
        data: "successfully liked",
      });
    } else if (commentTobeLiked.nModified === 0) {
      await CommentLike.updateOne(
        { comment: req.params.commentId },
        {
          $pull: { users: req.user.id },
        }
      );

      return res.status(200).json({
        status: "success",
        data: "successfully unliked",
      });
    }
    return next(new AppError("Some error occured!", 403));
  } catch (err) {
    next(err);
  }
};

exports.getAllComments = factory.getAll(Comment, {
  path: "article",
  select: "title slug",
  populate: {
    path: "user",
    select: "username",
  },
});
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment, { path: "commentLikes", select: "users -comment" });
// exports.updateComment = factory.updateOne(Comment);
// exports.deleteComment = factory.deleteOne(Comment);
