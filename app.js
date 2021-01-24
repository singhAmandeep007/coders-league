const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
var compression = require('compression')
// const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRoutes');
const commentRouter = require('./routes/commentRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const app = express();
// IMPLEMENT CORS
// app.use(cors());
// app.options('*', cors());
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
   );
   if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
      return res.status(200).json({});
   }
   return next();
});


app.use(cookieParser());
app.use(express.json({
   limit: '10kb'
}));

// COMPRESSION
app.use(compression())
// logging 
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}

// custom middlewares 
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
})



// routes middleware , mounting our routers.
// app.use('/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/comments', commentRouter);

// Handling unhandled routes.
app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// custom error handling
app.use(globalErrorHandler);

module.exports = app;