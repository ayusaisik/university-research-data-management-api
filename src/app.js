const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const departmentRoutes = require('./routes/department.routes');
const researcherRoutes = require('./routes/researcher.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/researchers', researcherRoutes);

module.exports = app;
