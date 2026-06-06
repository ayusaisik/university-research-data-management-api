const express = require('express');

const {
  getProjectCountByDepartment,
  getTotalBudgetByDepartment,
  getProjectCountByResearcher,
  getActiveProjects,
  getProjectsAboveBudget,
} = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/project-count-by-department', getProjectCountByDepartment);
router.get('/total-budget-by-department', getTotalBudgetByDepartment);
router.get('/project-count-by-researcher', getProjectCountByResearcher);
router.get('/active-projects', getActiveProjects);
router.get('/projects-above-budget', getProjectsAboveBudget);

module.exports = router;
