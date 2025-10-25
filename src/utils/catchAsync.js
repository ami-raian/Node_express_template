/**
 * Wrapper function to catch async errors
 * Eliminates try-catch blocks in controllers
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
