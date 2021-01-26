const mongoose = require('mongoose');
const AppError = require('./../utils/appError');
const { Schema } = mongoose;

const commentSchema = new Schema({
   text: {
      type: String,
      trim: true,
      required: [true, 'Comment must not be empty!']
   },
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a author!']
   },
   article: {
      type: mongoose.Schema.ObjectId,
      ref: 'Article',
      required: [true, 'Comment must belong a article!']
   }
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
}
);

// virtual populate
commentSchema.virtual('commentLikes', {
   ref: 'CommentLike',
   localField: '_id',
   foreignField: 'comment',
   justOne: true
})

commentSchema.pre('save', function (next) {
   // console.log('in pre save of comment model')
   const Article = require('./articleModel');
   Article.findById(this.article, function (err, doc) {
      //console.log(doc)
      if (!doc || err) {
         next(new AppError('No Article found with that ID', 404))
      } else {
         next()
      }
   });
});

commentSchema.pre(/^find/, function (next) {
   this.populate({
      path: 'user',
      select: 'username fullname photo'
   })
   // .populate({
   //    path: 'article',
   //    select: 'title'
   // })
   next()
})

commentSchema.statics.calcNumComments = function (articleId) {
   // console.log('from statics : articleId: ', articleId)
   const Article = require('./articleModel');
   this.countDocuments({ article: articleId }, async function (err, count) {
      if (err) {
         console.log(err);
      } else {
         await Article.findByIdAndUpdate(articleId, {
            commentCounts: count
         }, { runValidators: false });
      }
   })
}

commentSchema.post('save', async function () {
   // this points to current comment
   // console.log('article id: ', this.article);
   this.constructor.calcNumComments(this.article);
   const CommentLike = require('./commentLikeModel');
   await CommentLike.create({
      comment: this._id
   });
});



commentSchema.post(/^findOneAndDelete/, async function (doc) {
   if (doc) {
      await doc.constructor.calcNumComments(doc.article);
      const CommentLike = require('./commentLikeModel');
      await CommentLike.deleteOne({
         comment: doc._id
      });
   }
});

// for delete user
commentSchema.post('deleteOne', { document: true }, async function (doc) {
   await doc.constructor.calcNumComments(doc.article);
   const CommentLike = require('./commentLikeModel');
   await CommentLike.deleteOne({
      comment: doc._id
   });
   // console.log('DOC from post delteONe hook comment', doc)
})

module.exports = mongoose.model('Comment', commentSchema);