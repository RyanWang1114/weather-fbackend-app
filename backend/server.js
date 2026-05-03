const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const weatherRoutes = require('./routes/weather');
app.use('/api/weather', weatherRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Weather App Backend is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});