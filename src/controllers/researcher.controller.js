const pool = require('../db/pool');

const getAllResearchers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.first_name,
        r.last_name,
        r.email,
        r.department_id,
        d.name AS department_name,
        r.created_at
      FROM researchers r
      JOIN departments d ON r.department_id = d.id
      ORDER BY r.id;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch researchers:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch researchers',
    });
  }
};

const getResearcherById = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Researcher id must be a positive integer',
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT
          r.id,
          r.first_name,
          r.last_name,
          r.email,
          r.department_id,
          d.name AS department_name,
          r.created_at
        FROM researchers r
        JOIN departments d ON r.department_id = d.id
        WHERE r.id = $1;
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Researcher not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to fetch researcher:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch researcher',
    });
  }
};

const createResearcher = async (req, res) => {
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    department_id: departmentId,
  } = req.body || {};

  if (typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'First name is required',
    });
  }

  if (typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Last name is required',
    });
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  if (!Number.isInteger(departmentId) || departmentId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Department id must be a positive integer',
    });
  }

  try {
    const departmentResult = await pool.query(
      'SELECT id FROM departments WHERE id = $1;',
      [departmentId],
    );

    if (departmentResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Department does not exist',
      });
    }

    const result = await pool.query(
      `
        INSERT INTO researchers (first_name, last_name, email, department_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first_name, last_name, email, department_id, created_at;
      `,
      [
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        departmentId,
      ],
    );

    return res.status(201).json({
      success: true,
      message: 'Researcher created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'A researcher with this email already exists',
      });
    }

    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Department does not exist',
      });
    }

    console.error('Failed to create researcher:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create researcher',
    });
  }
};

module.exports = {
  getAllResearchers,
  getResearcherById,
  createResearcher,
};
