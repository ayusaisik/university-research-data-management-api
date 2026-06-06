const express = require('express');

const {
  getAllProjects,
  getProjectById,
  createProject,
} = require('../controllers/project.controller');

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);

module.exports = router;
