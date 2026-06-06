const pool = require('../db/pool');

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'University Research Data Management API is running',
  });
};

const getDatabaseHealth = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW();');

    res.status(200).json({
      success: true,
      message: 'Database connection is working',
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
};

module.exports = {
  getHealth,
  getDatabaseHealth,
};
