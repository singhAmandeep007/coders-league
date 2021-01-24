// Customisable AppError inherits from in-built Error class
class AppError extends Error {
   // constructor initialised with 2 arguments message and statusCode
   constructor(message, statusCode) {
      super(message);

      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
   }
}

module.exports = AppError; 