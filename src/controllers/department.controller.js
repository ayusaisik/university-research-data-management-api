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

const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Department id must be a positive integer',
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT id, name, description, created_at
        FROM departments
        WHERE id = $1;
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to fetch department:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch department',
    });
  }
};

const createDepartment = async (req, res) => {
  const { name, description } = req.body || {};

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Department name is required',
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO departments (name, description)
        VALUES ($1, $2)
        RETURNING id, name, description, created_at;
      `,
      [name.trim(), description || null],
    );

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to create department:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to create department',
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
};
