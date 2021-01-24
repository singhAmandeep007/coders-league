const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRoutes');
const commentRouter = require('./routes/commentRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const app = express();

app.use(cookieParser());
app.use(express.json({
   limit: '10kb'
}));
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