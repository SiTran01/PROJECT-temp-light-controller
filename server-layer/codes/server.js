// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Giao diện tĩnh nếu cần (dashboard đơn giản)
app.use(express.static(path.join(__dirname, 'public')));

// API route
const dataRoutes = require('./routes/data');
app.use('/api', dataRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express backend chạy tại http://localhost:${PORT}`);
});
