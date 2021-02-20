const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleLikeSchema = new Schema({
   article: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Article Like must belong a article!'],
      ref: "Article"
   },
   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         required: [true, 'Article Like must belong to a author!'],
         ref: 'User'
      }
   ]
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
}
);

articleLikeSchema.post("updateOne", async function (val) {
   if (val.nModified > 0) {
      const { article } = { ...this.getQuery() };
      const updatedDoc = await this.model.findOne({ "article": article });

      const Article = require('./../models/articleModel');
      await Article.updateOne({ _id: updatedDoc.article }, {
         likeCounts: updatedDoc.users.length
      }, { runValidators: false });
   }
})

module.exports = mongoose.model('ArticleLike', articleLikeSchema);