const Comment = require('../models/commentModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.setArticleUserIds = (req, res, next) => {
   console.log(req.params)
   if (req.params.articleId) {
      req.body.article = req.params.articleId;
      req.body.user = req.user.id;
      return next()
   }
   next(new AppError('Comment must be created on a article!', 401))
}

exports.checkOwnershipAndUpdate = catchAsync(async (req, res, next) => {
   console.log(req.params)

   const filter = { _id: req.params.id, article: req.params.articleId, user: req.user.id };
   // can be filtered what can be updated
   const update = { ...req.body };

   const comment = await Comment.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true
   });
   if (!comment) {
      return next(new AppError('No Article or Comment found with that ID or You are not authorised to perform this action.', 404))
   }
   return res.status(200).json({
      status: 'success',
      data: comment
   })
})

exports.checkOwnershipAndDelete = catchAsync(async (req, res, next) => {

   const filter = { _id: req.params.id, article: req.params.articleId, user: req.user.id };
   // can be filtered what can be updated

   const comment = await Comment.findOneAndDelete(filter);
   console.log(comment)

   if (!comment) {
      return next(new AppError('No Article or Comment found with that ID or You are not authorised to perform this action.', 404))
   }

   return res.status(204).json({
      status: 'success',
      data: null
   });

})

exports.getAllComments = factory.getAll(Comment)
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
// exports.updateComment = factory.updateOne(Comment);
// exports.deleteComment = factory.deleteOne(Comment); 
