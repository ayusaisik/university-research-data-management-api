const pool = require('../db/pool');

const allowedStatuses = ['planned', 'active', 'completed', 'cancelled'];

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  );
};

const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.description,
        p.status,
        p.budget,
        p.start_date,
        p.end_date,
        p.researcher_id,
        CONCAT(r.first_name, ' ', r.last_name) AS researcher_name,
        d.name AS department_name,
        p.created_at
      FROM projects p
      JOIN researchers r ON p.researcher_id = r.id
      JOIN departments d ON r.department_id = d.id
      ORDER BY p.id;
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch projects:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Project id must be a positive integer',
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          p.title,
          p.description,
          p.status,
          p.budget,
          p.start_date,
          p.end_date,
          p.researcher_id,
          CONCAT(r.first_name, ' ', r.last_name) AS researcher_name,
          d.name AS department_name,
          p.created_at
        FROM projects p
        JOIN researchers r ON p.researcher_id = r.id
        JOIN departments d ON r.department_id = d.id
        WHERE p.id = $1;
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to fetch project:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
};

const createProject = async (req, res) => {
  const {
    title,
    description,
    researcher_id: researcherId,
    status,
    budget,
    start_date: startDate,
    end_date: endDate,
  } = req.body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required',
    });
  }

  if (!Number.isInteger(researcherId) || researcherId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Researcher id must be a positive integer',
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be planned, active, completed, or cancelled',
    });
  }

  if (typeof budget !== 'number' || !Number.isFinite(budget) || budget < 0) {
    return res.status(400).json({
      success: false,
      message: 'Budget must be a non-negative number',
    });
  }

  if (!isValidDate(startDate)) {
    return res.status(400).json({
      success: false,
      message: 'Start date is required and must use YYYY-MM-DD format',
    });
  }

  const normalizedEndDate = (
    endDate === undefined
    || endDate === null
    || endDate === ''
  )
    ? null
    : endDate;

  if (normalizedEndDate !== null && !isValidDate(normalizedEndDate)) {
    return res.status(400).json({
      success: false,
      message: 'End date must use YYYY-MM-DD format',
    });
  }

  if (normalizedEndDate !== null && normalizedEndDate < startDate) {
    return res.status(400).json({
      success: false,
      message: 'End date cannot be earlier than start date',
    });
  }

  try {
    const researcherResult = await pool.query(
      'SELECT id FROM researchers WHERE id = $1;',
      [researcherId],
    );

    if (researcherResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Researcher does not exist',
      });
    }

    const result = await pool.query(
      `
        INSERT INTO projects (
          title,
          description,
          researcher_id,
          status,
          budget,
          start_date,
          end_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          title,
          description,
          researcher_id,
          status,
          budget,
          start_date,
          end_date,
          created_at;
      `,
      [
        title.trim(),
        description || null,
        researcherId,
        status,
        budget,
        startDate,
        normalizedEndDate,
      ],
    );

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Researcher does not exist',
      });
    }

    console.error('Failed to create project:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
};
