const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentLikeSchema = new Schema({
   comment: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Comment Like must belong a comment!'],
      ref: 'Comment'
   },
   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         required: [true, 'Comment Like must belong to a author!'],
         ref: 'User'
      }
   ]
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
}
);

module.exports = mongoose.model('CommentLike', commentLikeSchema);