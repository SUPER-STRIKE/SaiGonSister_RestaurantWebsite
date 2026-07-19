function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.name === 'MulterError' || err.message === 'Only image uploads are allowed') {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message,
  });
}

module.exports = errorHandler;
