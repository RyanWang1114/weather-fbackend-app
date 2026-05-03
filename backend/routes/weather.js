const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// CRUD routes
router.post('/queries', weatherController.createWeatherQuery);
router.get('/queries', weatherController.getQueries);
router.get('/queries/:id', weatherController.getQueries);
router.put('/queries/:id', weatherController.updateQuery);
router.delete('/queries/:id', weatherController.deleteQuery);

// Weather forecast endpoint
router.get('/forecast', weatherController.getForecastForLocation);

// Export endpoint
router.get('/export/csv', weatherController.exportToCSV);
// Add to existing routes
router.get('/current', async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: 'Location required' });
  try {
    const weather = await require('../utils/weatherAPI').getCurrentWeather(location);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

