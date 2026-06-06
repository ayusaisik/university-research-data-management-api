const express = require('express');

const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
} = require('../controllers/department.controller');

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.post('/', createDepartment);

module.exports = router;
