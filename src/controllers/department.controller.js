const pool = require('../db/pool');

const getAllDepartments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, created_at
      FROM departments
      ORDER BY id;
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message,
    });
  }
};

module.exports = {
  getAllDepartments,
};
