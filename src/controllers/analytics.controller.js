const pool = require('../db/pool');

const getProjectCountByDepartment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id AS department_id,
        d.name AS department_name,
        COUNT(p.id) AS project_count
      FROM departments d
      LEFT JOIN researchers r ON r.department_id = d.id
      LEFT JOIN projects p ON p.researcher_id = r.id
      GROUP BY d.id, d.name
      ORDER BY project_count DESC;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch project count by department:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
    });
  }
};

const getTotalBudgetByDepartment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id AS department_id,
        d.name AS department_name,
        COALESCE(SUM(p.budget), 0) AS total_budget
      FROM departments d
      LEFT JOIN researchers r ON r.department_id = d.id
      LEFT JOIN projects p ON p.researcher_id = r.id
      GROUP BY d.id, d.name
      ORDER BY total_budget DESC;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch total budget by department:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
    });
  }
};

const getProjectCountByResearcher = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id AS researcher_id,
        CONCAT(r.first_name, ' ', r.last_name) AS researcher_name,
        d.name AS department_name,
        COUNT(p.id) AS project_count
      FROM researchers r
      JOIN departments d ON r.department_id = d.id
      LEFT JOIN projects p ON p.researcher_id = r.id
      GROUP BY r.id, r.first_name, r.last_name, d.name
      ORDER BY project_count DESC;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch project count by researcher:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
    });
  }
};

const getActiveProjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.status,
        p.budget,
        p.start_date,
        p.end_date,
        CONCAT(r.first_name, ' ', r.last_name) AS researcher_name,
        d.name AS department_name
      FROM projects p
      JOIN researchers r ON p.researcher_id = r.id
      JOIN departments d ON r.department_id = d.id
      WHERE p.status = 'active'
      ORDER BY p.start_date;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch active projects:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
    });
  }
};

const getProjectsAboveBudget = async (req, res) => {
  const { minBudget } = req.query;
  const parsedMinBudget = Number(minBudget);

  if (
    typeof minBudget !== 'string'
    || minBudget.trim() === ''
    || !Number.isFinite(parsedMinBudget)
    || parsedMinBudget < 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'minBudget query parameter is required and must be a non-negative number',
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          p.title,
          p.status,
          p.budget,
          CONCAT(r.first_name, ' ', r.last_name) AS researcher_name,
          d.name AS department_name
        FROM projects p
        JOIN researchers r ON p.researcher_id = r.id
        JOIN departments d ON r.department_id = d.id
        WHERE p.budget > $1
        ORDER BY p.budget DESC;
      `,
      [parsedMinBudget],
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch projects above budget:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
    });
  }
};

module.exports = {
  getProjectCountByDepartment,
  getTotalBudgetByDepartment,
  getProjectCountByResearcher,
  getActiveProjects,
  getProjectsAboveBudget,
};
