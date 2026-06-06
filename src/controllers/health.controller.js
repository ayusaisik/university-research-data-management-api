const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'University Research Data Management API is running',
  });
};

module.exports = {
  getHealth,
};
