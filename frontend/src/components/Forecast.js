import React from 'react';

const Forecast = ({ data }) => {
  // Group by day (OpenWeatherMap returns every 3 hours)
  const daily = data.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dailyForecast = Object.keys(daily).slice(0, 5).map(date => {
    const items = daily[date];
    // Get midday reading or average
    const midday = items.find(item => item.dt_txt.includes('12:00:00')) || items[0];
    return {
      date,
      temp: midday.main.temp,
      icon: midday.weather[0].icon,
      description: midday.weather[0].description
    };
  });

  return (
    <div className="card">
      <h2>5-Day Forecast</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {dailyForecast.map((day, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt={day.description} />
            <p>{Math.round(day.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;