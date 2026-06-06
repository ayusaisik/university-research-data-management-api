const express = require('express');

const {
  getAllResearchers,
  getResearcherById,
  createResearcher,
} = require('../controllers/researcher.controller');

const router = express.Router();

router.get('/', getAllResearchers);
router.get('/:id', getResearcherById);
router.post('/', createResearcher);

module.exports = router;
