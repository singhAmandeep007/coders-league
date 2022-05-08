const mongoose = require('mongoose');
const { Schema } = mongoose;

const crypto = require('crypto');
const validator = require('validator');
const bcyrptjs = require('bcryptjs');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Please specify a username!'],
      unique: [true, 'This username is already taken!'],
      index: true,
      minlength: [5, 'Username must have at least 5 characters. '],
      maxlength: [20, 'Username can have at most 20 characters. '],
      validate: {
        validator: function (v) {
          return !/\s/.test(v);
        },
        message: 'Username cannot contain space.',
      },
    },
    email: {
      type: String,
      required: [true, 'Please specify your email!'],
      unique: [true, 'This email already exists!'],
      trim: true,
      index: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please specify a valid email!'],
    },
    fullname: {
      type: String,
      trim: true,
      default: function () {
        return this.username || '';
      },
    },
    photo: {
      type: String,
      // DEFAULT IMAGE FOR NEW USER
      default:
        'https://res.cloudinary.com/dryiuvv1l/image/upload/v1609346522/dev_setups/default_profile_pbiqsk.jpg',
    },
    photoId: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    skills: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      validate: {
        validator: function (val) {
          if (val) {
            return validator.isURL(val);
          }
          return;
        },
        message: 'Please specify a valid URL!',
      },
    },
    role: {
      type: String,
      trim: true,
      // only these types of roles are allowed
      enum: {
        values: ['user', 'moderator', 'lead-moderator', 'admin'],
        message:
          'Only these Roles can be alloted: user , moderator , lead-moderator , admin.',
      },
      default: 'user',
    },
    emailNotification: {
      topArticles: {
        type: Boolean,
        default: false,
      },
      tips: {
        type: Boolean,
        default: false,
      },
    },
    googleId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, 'Please specify a password!'],
      minlength: [5, 'Password must have more than 5 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      validate: {
        // works only on create and save
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//indexes
// userSchema.index({ email: 1, username: 1 }, { unique: true })

// virtual populate
userSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'user',
});
userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user',
});
userSchema.virtual('usersFollowing', {
  ref: 'UserFollow',
  localField: '_id',
  foreignField: 'user',
  justOne: true,
});
// DOC middleware
// Encrypting password before actually saving the document
userSchema.pre('save', async function (next) {
  // if password is not modified exit and call next middleware.
  if (!this.isModified('password')) {
    return next();
  }
  // hash/encrypt the password for the cost of 12, it will salt the password ie adding random strings to the password
  this.password = await bcyrptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// Updating passwordChangedAt field if password is modified
userSchema.pre('save', function (next) {
  // before saving check if password is changed or there is new record of user
  // 1) if false return to next middleware
  if (!this.isModified('password') || this.isNew) return next();
  // 2) else -->
  /**
   * as we have already implemented functionality to check if the password was changed after jwt was issued (then relogin)
   * so to avoid it causing any issue or error in our app due to some lag which caused jwt to be issued before this field was set
   * we less 2 seconds to fix it.
   */
  this.passwordChangedAt = Date.now() - 2000;
  next();
});

userSchema.pre('save', async function (next) {
  // console.log('this', this)
  // this points to current user
  if (this.isNew) {
    const UserFollow = require('./userFollowModel');
    await UserFollow.create({
      user: this._id,
    });
  }
  next();
});

// QUERY middleware
// userSchema.pre(/^find/, function (next) {
//    // this points to current query
//    this.find({ active: { $ne: false } });
//    next();
// })

// DELETE USER
userSchema.post(/^findOneAndDelete/, async function (doc) {
  if (doc) {
    const Article = require('./../models/articleModel');
    const Comment = require('./../models/commentModel');
    const UserFollow = require('./userFollowModel');
    // first find all articles with matching user id
    const articles = await Article.find({
      user: doc._id,
    });
    // if there is any then iterate over each and delete all comments on it and then delete the article itself
    if (articles && articles.length > 0) {
      articles.forEach(async (doc) => {
        await Comment.deleteMany({ article: doc._id });
        await doc.deleteOne();
      });
    }
    // Then find all comments with matching user id that are genrated on other articles
    const comments = await Comment.find({
      user: doc._id,
    });
    // if there is any then iterate over each and delete comment with deleteOne operation which will trigger post deleteOne hook
    // and invoke calcNumComments
    if (comments && comments.length > 0) {
      comments.forEach(async (doc) => {
        await doc.deleteOne();
      });
    }
    // delete userFollow document matching the user id
    await UserFollow.deleteOne({ user: doc._id });
  }
});

// custom METHODS , creating an instance method ,Instances of Models are documents.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcyrptjs.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // for users who have never changed password this field won't exist
  if (this.passwordChangedAt) {
    // converting the date into milliseconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // storing 10 mins in milliseconds in passwordResetExpire
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //console.log('resetToken:', resetToken, 'passwordResetToken:', this.passwordResetToken)
  return resetToken;
};

userSchema.methods.countArticles = async function (userId) {
  const Article = require('./../models/articleModel');
  return await Article.countDocuments({ user: userId });
};
userSchema.methods.countComments = async function (userId) {
  const Comment = require('./../models/commentModel');
  return await Comment.countDocuments({ user: userId });
};

module.exports = mongoose.model('User', userSchema);
