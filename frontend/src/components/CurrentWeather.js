import React from 'react';

const CurrentWeather = ({ data }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
  return (
    <div className="card">
      <h2>Current Weather in {data.name}</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={iconUrl} alt={data.weather[0].description} />
        <div>
          <p style={{ fontSize: '2em', margin: 0 }}>{Math.round(data.main.temp)}°C</p>
          <p>{data.weather[0].description}</p>
          <p>Feels like: {Math.round(data.main.feels_like)}°C</p>
          <p>Humidity: {data.main.humidity}%</p>
          <p>Wind: {data.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;