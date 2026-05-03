const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function getCurrentWeather(location) {
    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: location,
                appid: API_KEY,
                units: 'metric'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }
}

async function getForecast(location) {
    try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                q: location,
                appid: API_KEY,
                units: 'metric',
                cnt: 40  // 5 days * 8 readings per day (3-hour intervals)
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch forecast data');
    }
}

module.exports = { getCurrentWeather, getForecast };