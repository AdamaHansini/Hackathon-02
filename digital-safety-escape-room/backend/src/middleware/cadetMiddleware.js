export const cadetOnly = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Admin accounts are restricted to threat management.'
  });
};