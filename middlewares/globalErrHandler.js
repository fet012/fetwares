export const globalErrHandler = (err, req, res, next) => {
  // STACK
  // MESSAGE
  const stack = err?.stack;
  const statuscode = err?.statusCode ? err?.statusCode : 500;
  const message = err?.message;

  res.status(statuscode).json({
    stack,
    message,
  });
};


// 404 HANDLER
export const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`)
  next(err)
  
}