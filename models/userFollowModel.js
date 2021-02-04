const mongoose = require('mongoose');
const { Schema } = mongoose;

const userFollowSchema = new Schema({
   user: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'User Follow must belong a user!'],
      ref: "User"
   },
   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         required: [true, 'User Follow must belong to a author!'],
         ref: 'User'
      }
   ]
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
}
);

module.exports = mongoose.model('UserFollow', userFollowSchema);