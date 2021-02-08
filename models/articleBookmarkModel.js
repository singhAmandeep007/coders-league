const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleBookmarkSchema = new Schema({
   article: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Article Bookmark must belong a article!'],
      ref: "Article"
   },
   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         required: [true, 'Article Bookmark must belong to a author!'],
         ref: 'User'
      }
   ]
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
}
);

articleBookmarkSchema.index({ timestamps: 1 });

module.exports = mongoose.model('ArticleBookmark', articleBookmarkSchema);