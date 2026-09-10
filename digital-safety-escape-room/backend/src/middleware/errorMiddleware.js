export const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err.message || err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error. Please try again later.'
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found - ${req.originalUrl}`
  });
};
