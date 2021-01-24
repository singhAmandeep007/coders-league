const Article = require('./../models/articleModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
//const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopFiveArticle = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-likeCounts,-commentCounts';
    req.query.fields = 'title , body, likeCounts , commentCounts, tags , expertiseLevel';
    next()
}

exports.setQuery = (req, res, next) => {
    // req.query.limit = '5';
    req.query.sort = '-createdAt';
    req.query.fields = '-body -image -images';
    next()
}
// assign the user id to the article document so that later we could check its ownership
exports.setUserId = (req, res, next) => {
    req.body.user = req.user.id;
    next()
}

exports.checkOwnershipAndUpdate = catchAsync(async (req, res, next) => {

    const filter = { _id: req.params.id, user: req.user.id };
    // can be filtered what can be updated
    const update = { ...req.body };

    const article = await Article.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true
    });

    if (!article) {
        return next(new AppError('No Article found with that ID or You are not authorised to perform this action.', 404))
    }
    // to trigger slugify of title
    await article.save({ validateBeforeSave: false });

    return res.status(200).json({
        status: 'success',
        data: article
    })
})

exports.checkOwnershipAndDelete = catchAsync(async (req, res, next) => {

    const filter = { _id: req.params.id, user: req.user.id };
    // can be filtered what can be updated

    const article = await Article.findOneAndDelete(filter);

    if (!article) {
        return next(new AppError('No Article found with that ID or You are not authorised to perform this action.', 404))
    }

    return res.status(204).json({
        status: 'success',
        data: null
    });

})

exports.getAllArticles = factory.getAll(Article, { path: 'user', select: "username fullname photo" });
// we pass the populate in this as we need all the comments filled up for that particular article we are trying to retrieve , we could also specify select, etc.
//, [{ path: 'user', select: "username fullname photo location createdAt" }, { path: 'comments' }])
exports.getArticle = factory.getOne(Article);
exports.createArticle = factory.createOne(Article);
// exports.updateArticle = factory.updateOne(Article, true);
// exports.deleteArticle = factory.deleteOne(Article);