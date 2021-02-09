const mongoose = require("mongoose");
const multer = require('multer');

const schedule = require('node-schedule');

const User = require('./../models/userModel');
const ArticleBookmark = require('./../models/articleBookmarkModel');
const UserFollow = require('./../models/userFollowModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const { cloudinary } = require('./../services/cloudinary');
const Email = require('./../utils/email');

//const job = schedule.scheduleJob('0-59/50 * * * * *', async function () {
const job = schedule.scheduleJob('* * 1 * * *', async function () {
   const usersToBeNotified = await User.find({ emailNotification: { $ne: false } });

   if (usersToBeNotified && usersToBeNotified.length > 0) {
      const Article = require('./../models/articleModel');
      // TOP 5 PER WEEK 
      const topArticles = await Article.aggregate([
         {
            $match: {
               createdAt: {
                  $gte: new Date(new Date().setDate(new Date().getDate() - 7))
               }
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "user",
               foreignField: "_id",
               as: "user",
            },

         },
         {
            $sort: { likeCounts: -1, commentCounts: -1 }
         },
         {
            $limit: 5
         },
         {
            $project: {
               "user._id": 1,
               "user.fullname": 1,
               "user.username": 1,
               "user.photo": 1,
               "title": 1,
               "shortDescription": 1,
               "readingTime": 1,
               "slug": 1,
               "image": 1
            }
         }
      ]);

      usersToBeNotified.forEach(async (user) => {

         let userObj = {
            email: user.email,
            fullname: user.fullname,
            photo: user.photo,
            username: user.username,
            topArticles
         }
         await new Email(userObj).sendTopArticles();
      })
   }
});


const filterObj = (obj, ...allowedFields) => {
   let newObj = {};
   Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) {
         newObj[el] = obj[el];
      }
   })
   return newObj;
}
const storage = multer.diskStorage({
   filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname);
   }
});
// This function is for filtering the files that are being upload to only be the specified types of 'images'
const imageFilter = function (req, file, cb) {
   if (file.mimetype.startsWith('image')) {
      cb(null, true)
   } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
   }
};
const upload = multer({
   storage: storage,
   fileFilter: imageFilter,
   limits: { fileSize: 8000000 }
});

exports.getMe = (req, res, next) => {
   req.params.id = req.user.id;
   next();
};

exports.getUserProfile = factory.getOne(User)

// User Reading List 
exports.getUserReadingList = catchAsync(async (req, res) => {
   const readingList = await ArticleBookmark
      .find({ users: { $eq: req.user.id } })
      .select('-users')
      .populate({ path: 'article', select: '-body -image -images', populate: { path: 'user', select: 'username fullname photo' } })

   res.status(200).json({
      status: 'success',
      data: readingList
   })
})

exports.uploadUserPhoto = upload.single('photo');

exports.updateMe = catchAsync(async (req, res, next) => {
   // console.log('req.body', req.body);
   // 1) create error if user POSTs password data or tries to update password through this route
   if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
   }
   if (req.file) {
      await cloudinary.uploader.upload(req.file.path, {
         upload_preset: 'dev_setups',
         transformation: ["profileImageCodersLeague"]
         // eager: [
         //     { gravity: "auto", height: 300, quality: 100, width: 300, crop: "fill" }
         // ]
      }, (err, result) => {
         if (err) {
            console.log('err', err);
            return next(new AppError('Error in uploading Photo', 500));
         }
         // console.log(result);
         req.body.photoId = result.public_id;
         req.body.photo = result.secure_url
      })
   }

   // 2) filtered out unwanted field-names that are not allowed to be updated
   const filteredBody = filterObj(req.body, 'fullname', 'username', 'email', 'photo', 'photoId', 'location', 'skills', 'bio', 'url');
   // 3) update user doc
   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

   res.status(200).json({
      status: 'success',
      data: {
         user: updatedUser
      }
   })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
   // delete user , in post hook delete all linked comments and articles
   await User.findOneAndDelete({ _id: req.user.id })
   res.status(204).json({
      status: 'success',
      data: null
   })
})

exports.getFollowing = catchAsync(async (req, res) => {
   const followingUsers = await UserFollow
      .find({ user: req.user.id })
      .select('users')
   res.status(200).json({
      status: 'success',
      data: followingUsers
   })
})

exports.getFollowingAndFollowers = catchAsync(async (req, res) => {

   const followingAndFollowers = await UserFollow.aggregate([
      {
         $facet: {

            "following": [
               {
                  $match: {
                     user: mongoose.Types.ObjectId(req.user.id)
                  },
               },
               {
                  $lookup: {
                     from: "users",
                     localField: "users",
                     foreignField: "_id",
                     as: "followingInfo",
                  },
               },
               {
                  $project: {
                     "followingInfo._id": 1,
                     "followingInfo.fullname": 1,
                     "followingInfo.username": 1,
                     "followingInfo.photo": 1
                  }
               }

            ],
            "followers": [
               {
                  $match: {
                     users: { $in: [mongoose.Types.ObjectId(req.user.id), "$users"] },
                  },
               },
               {
                  $lookup: {
                     from: "users",
                     localField: "user",
                     foreignField: "_id",
                     as: "followerInfo",
                  },
               },
               {
                  $project: {
                     "followerInfo._id": 1,
                     "followerInfo.fullname": 1,
                     "followerInfo.username": 1,
                     "followerInfo.photo": 1,

                  }
               }
            ]
         }
      },
      {
         $project: {
            following: 1,
            followers: 1,
            totalFollowing: { $size: { $arrayElemAt: ["$following.followingInfo", 0] } },
            totalFollowers: { $size: "$followers" }
         }
      }

   ])
   console.log('followingAndFollowers', followingAndFollowers)
   res.status(200).json({
      status: 'success',
      data: {
         following: followingAndFollowers[0].following[0].followingInfo,
         followers: followingAndFollowers[0].followers.map((follower) => {
            return { ...follower.followerInfo[0] }
         }),
         totalFollowing: followingAndFollowers[0].totalFollowing,
         totalFollowers: followingAndFollowers[0].totalFollowers
      }
   })
})

exports.setUserFollow = async (req, res, next) => {
   try {

      let doc = await User.findById(req.params.userId);
      if (!doc) {
         return next(new AppError('No User found with that ID', 404))
      }
      // updateOne
      let userToBeFollowed = await UserFollow.updateOne(
         {
            user: req.user.id,
            "users": { $ne: req.params.userId }
         },
         {
            $addToSet: { users: req.params.userId }
         }
      )

      if (userToBeFollowed.nModified === 1) {
         //1 means, modification, that means its followed
         return res.status(200).json({
            status: 'success',
            data: 'successfully followed user',
         })
      } else if (userToBeFollowed.nModified === 0) {
         await UserFollow.updateOne(
            { user: req.user.id },
            {
               $pull: { users: req.params.userId }
            }
         )

         return res.status(200).json({
            status: 'success',
            data: 'successfully unfollowed user',
         })
      }
      return next(new AppError('You are not authorised to perform this action', 403))
   } catch (err) {
      next(err)
   }
}

exports.handleContact = async (req, res, next) => {
   try {
      let user = {};
      if (req.body.fullname) user['fullname'] = req.body.fullname;
      if (req.body.userEmail) user['userEmail'] = req.body.userEmail;
      if (req.body.message) user['message'] = req.body.message;
      if (req.body.subject) user['subject'] = req.body.subject;
      // IMPORTANT
      user['email'] = 'grim.developers@gmail.com';

      await new Email(user).sendTicket();

      res.status(200).json({
         status: 'success',
         message: 'Sent email!'
      })
   } catch (err) {
      // if any error appears in sending email do this.
      return next(new AppError('Error sending the email. Try again later!', 500))
   }
}

// ADMIN ROUTES
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead.'
   })
}
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User); 