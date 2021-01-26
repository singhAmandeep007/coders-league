const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const expressSanitizer = require('express-sanitizer');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression')

const authRouter = require('./routes/authRoutes');
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

//SECURITY
app.use(helmet({
   contentSecurityPolicy: {
      directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'", "https://*.com"],
         connectSrc: ["'self'", 'https://*.com'],
         styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
         imgSrc: ["'self'", 'https://*.com', 'data:'],
         fontSrc: ["'self'", 'https://*.com', 'data:']
      },
   }
}));

// Rate Limiting
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,// 1 hour
   message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// HTML sanitizer
app.use(expressSanitizer());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(hpp({
   whitelist: ['tags', 'likeCounts', 'commentCounts']
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
app.use('/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/comments', commentRouter);

if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.resolve(__dirname, 'client', 'build')));
   app.get('*', (req, res) => {
      res.sendFile(
         path.resolve(__dirname, 'client', 'build', 'index.html')
      );
   });
}

// Handling unhandled routes.
app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// custom error handling
app.use(globalErrorHandler);

module.exports = app;