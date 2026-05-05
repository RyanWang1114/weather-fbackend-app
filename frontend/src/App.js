import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchForm from './components/SearchForm';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherHistory from './components/WeatherHistory';
import MapEmbed from './components/MapEmbed';
import AboutFooter from './components/AboutFooter';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showMap, setShowMap] = useState(false);

  // Fetch saved history on initial load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/weather/queries');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleSearch = async (searchLocation) => {
    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecastData(null);
    setLocation(searchLocation);
    setShowMap(true);

    try {
      // Fetch current weather and forecast in parallel
      const [currentRes, forecastRes] = await Promise.all([
  axios.get(`http://localhost:5000/api/weather/current?location=${encodeURIComponent(searchLocation)}`),
  axios.get(`http://localhost:5000/api/weather/forecast?location=${encodeURIComponent(searchLocation)}`)
]);

      setWeatherData(currentRes.data);
      setForecastData(forecastRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data. Please check the location.');
      setShowMap(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async (startDate, endDate) => {
    if (!location) {
      alert('No location selected.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/weather/queries', {
        location,
        startDate: startDate || null,
        endDate: endDate || null
      });
      fetchHistory();
      alert('Weather query saved to history!');
    } catch (err) {
      alert('Error saving: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/weather/queries/${id}`);
      fetchHistory();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleExport = () => {
    window.open('http://localhost:5000/api/weather/export/csv', '_blank');
  };

  return (
    <div className="container">
      <h1>🌤️ Weather App</h1>
      <p>by Ryan Wang – PM Accelerator Intern Assessment</p>
      
      <SearchForm onSearch={handleSearch} />
      
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading weather data...</div>}
      
      {weatherData && (
        <>
          <CurrentWeather data={weatherData} />
          <div className="card">
            <h3>Save this Query</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <input type="date" id="startDate" placeholder="Start Date (optional)" />
              <input type="date" id="endDate" placeholder="End Date (optional)" />
              <button onClick={() => {
                const start = document.getElementById('startDate').value;
                const end = document.getElementById('endDate').value;
                handleSaveToHistory(start || null, end || null);
              }}>Save to History</button>
              <button onClick={() => handleSaveToHistory(null, null)}>Quick Save (No Dates)</button>
            </div>
          </div>
        </>
      )}
      
      {forecastData && <Forecast data={forecastData} />}
      
      {showMap && location && <MapEmbed location={location} />}
      
      <WeatherHistory 
        history={history} 
        onDelete={handleDelete} 
        onExport={handleExport}
        onRefresh={fetchHistory}
      />
      
      <AboutFooter />
    </div>
  );
}

export default App;