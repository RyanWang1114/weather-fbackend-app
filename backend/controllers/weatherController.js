const db = require('../db/connection');
const { getCurrentWeather, getForecast } = require('../utils/weatherAPI');

// CREATE - Save a weather query
exports.createWeatherQuery = async (req, res) => {
    const { location, startDate, endDate } = req.body;
    
    // Validation
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ error: 'Start date must be before end date' });
    }

    try {
        // Fetch current weather to verify location exists
        const weather = await getCurrentWeather(location);
        const temp = weather.main.temp;
        
        // Save to database
        const [result] = await db.query(
            `INSERT INTO weather_queries (location, start_date, end_date, temperature, weather_data)
             VALUES (?, ?, ?, ?, ?)`,
            [location, startDate || null, endDate || null, temp, JSON.stringify(weather)]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Weather query saved successfully' 
        });
    } catch (error) {
        if (error.message.includes('Failed to fetch weather')) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.status(500).json({ error: error.message });
    }
};

// READ - Get all saved queries (with optional ID parameter)
exports.getQueries = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const [rows] = await db.query('SELECT * FROM weather_queries WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Record not found' });
            }
            return res.json(rows[0]);
        }
        const [rows] = await db.query('SELECT * FROM weather_queries ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE - Update a saved query
exports.updateQuery = async (req, res) => {
    const { id } = req.params;
    const { location, startDate, endDate } = req.body;
    
    try {
        // Fetch updated weather if location changed
        let temp = null;
        let weatherData = null;
        if (location) {
            const weather = await getCurrentWeather(location);
            temp = weather.main.temp;
            weatherData = JSON.stringify(weather);
        }
        
        // Build dynamic update query
        let updateFields = [];
        let values = [];
        if (location) {
            updateFields.push('location = ?');
            values.push(location);
        }
        if (startDate !== undefined) {
            updateFields.push('start_date = ?');
            values.push(startDate);
        }
        if (endDate !== undefined) {
            updateFields.push('end_date = ?');
            values.push(endDate);
        }
        if (temp !== null) {
            updateFields.push('temperature = ?');
            values.push(temp);
        }
        if (weatherData !== null) {
            updateFields.push('weather_data = ?');
            values.push(weatherData);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(id);
        const [result] = await db.query(
            `UPDATE weather_queries SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Record updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE - Remove a record
exports.deleteQuery = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM weather_queries WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FORECAST - Get 5-day forecast for a location (no DB storage)
exports.getForecastForLocation = async (req, res) => {
    const { location } = req.query;
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }
    try {
        const forecast = await getForecast(location);
        res.json(forecast);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// EXPORT - Export data as CSV
// EXPORT - Export data as CSV (with clean date formatting)
exports.exportToCSV = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, location, start_date, end_date, temperature, created_at FROM weather_queries');
        
        // Create CSV header
        let csv = 'ID,Location,Start Date,End Date,Temperature (°C),Created At\n';
        
        // Add rows with formatted dates
        rows.forEach(row => {
            const startDate = row.start_date ? new Date(row.start_date).toISOString().split('T')[0] : '';
            const endDate = row.end_date ? new Date(row.end_date).toISOString().split('T')[0] : '';
            const createdAt = row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 19) : '';
            
            csv += `${row.id},"${row.location}",${startDate},${endDate},${row.temperature},${createdAt}\n`;
        });
        
        res.header('Content-Type', 'text/csv');
        res.attachment('weather_queries.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};