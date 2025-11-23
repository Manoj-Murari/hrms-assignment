const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes & Middleware
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const verifyToken = require('./middleware/auth');

// --- DEBUGGING LOGS ---
// These help identify which file is causing the crash
console.log('Checking Imports...');
console.log('1. authRoutes:', typeof authRoutes === 'function' ? 'OK' : 'ERROR (Check exports)');
console.log('2. verifyToken:', typeof verifyToken === 'function' ? 'OK' : 'ERROR (Check exports)');
console.log('3. employeeRoutes:', typeof employeeRoutes === 'function' ? 'OK' : 'ERROR (Check exports)');
console.log('4. teamRoutes:', typeof teamRoutes === 'function' ? 'OK' : 'ERROR (Check exports)');
// ----------------------

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes (Require Token)
app.use('/api/employees', verifyToken, employeeRoutes);
app.use('/api/teams', verifyToken, teamRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
    res.send('HRMS API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});// trigger restart
