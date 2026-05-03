import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSearch(`${latitude},${longitude}`);
        },
        (error) => {
          alert('Unable to retrieve location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation not supported');
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city, zip, or coordinates"
          style={{ width: '300px' }}
        />
        <button type="submit">Get Weather</button>
        <button type="button" onClick={handleCurrentLocation}>
          Use My Location
        </button>
      </form>
    </div>
  );
};

export default SearchForm;