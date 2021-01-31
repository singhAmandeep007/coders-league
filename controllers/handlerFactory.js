const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAll = (Model, populateOptions) => catchAsync(async (req, res, next) => {
   // to allow for nested GET comments on article (kind of hack)
   console.log('req.query', req.query)
   let filter = {};
   if (req.query.tags) {
      var temp = new Array()
      temp = req.query.tags.split(',')

      filter["tags"] = {
         "$all": [...temp]
      }
   }
   if (req.query.title) {
      filter["$text"] = { "$search": `${req.query.title}` }
   }
   // if articleId is defined we redefine filter obj to find article field matching params.articleId
   if (req.params.articleId) filter["article"] = req.params.articleId;

   // all our resources using this factory fn will get api features 
   console.log('fiter', filter);
   const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

   let doc;
   if (populateOptions) {
      doc = await features.query.populate(populateOptions);
   } else {
      doc = await features.query;
   }

   res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc
   });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
   console.log(req.params)
   let filter = {};
   // /:id
   if (req.params.id) filter["_id"] = req.params.id;
   // /:articleId
   if (req.params.articleId) filter["article"] = req.params.articleId;
   // if (req.params.username) filter["username"] = req.params.username;
   let query;

   // /:username/:slug
   if (req.params.username && req.params.slug) {
      filter["slug"] = req.params.slug;
      query = Model.findOne(filter);
      query.populate([
         {
            path: 'user',
            username: req.params.username,
            select: "username fullname photo bio createdAt"
         },
         {
            path: 'comments',
            populate: {
               path: 'commentLikes',
               select: "users -comment"
            }
         },
         {
            path: 'articleLikes',
            populate: 'articleLikes',
            select: 'users -article'
         },
         {
            path: 'articleBookmarks',
            populate: 'articleBookmarks',
            select: 'users -article'
         }
      ])
   }
   // /profile/:username
   else if (req.params.username && !req.params.slug) {
      filter["username"] = req.params.username;
      query = Model.findOne(filter);
      query.populate([
         {
            path: 'articles',
            select: '-body -image -images',
            populate: {
               path: 'user',
               select: "username fullname photo"
            }
         },
         {
            path: 'comments',
            select: "text -user",
            populate: {
               path: 'article',
               select: "title slug",
               populate: {
                  path: 'user',
                  select: "username"
               }
            }
         }
      ])
   }

   else {
      query = Model.findOne(filter)
      if (populateOptions) query = query.populate(populateOptions);
   }

   const doc = await query;
   if (!doc) {
      return next(new AppError('No document found with that ID', 404))
   }
   res.status(200).json({
      status: 'success',
      data: doc
   })
})

exports.createOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
   let doc = await Model.create(req.body);

   if (populateOptions) {
      doc = await doc.populate(populateOptions).execPopulate()
   }

   res.status(200).json({
      status: 'success',
      data: doc
   })
})

exports.updateOne = (Model, presave = false) => catchAsync(async (req, res, next) => {
   // console.log(req.params.id, req.body)
   const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
   });

   if (!doc) {
      return next(new AppError('No document found with that ID', 404))
   }
   //console.log(presave);
   // to trigger pre save hook which will update slug
   if (presave) {
      await doc.save({ validateBeforeSave: false });
   }

   res.status(200).json({
      status: 'success',
      data: doc
   })

})

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
   const doc = await Model.findByIdAndDelete(req.params.id);
   if (!doc) {
      return next(new AppError('No document found with that ID', 404));
   }
   res.status(204).json({
      status: 'success',
      data: null
   });
})