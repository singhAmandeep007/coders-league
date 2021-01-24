module.exports = (fn) => {
   return (req, res, next) => {
      fn(req, res, next).catch(err => next(err))
   }
}
/**
 * --> returns anonymous function.
 * --> we need next here to pass to the next middleware so that it end up in global error handler.
 *--> all async functions returns promise,so in case if we have error we can use catch block to catch it.
 */
