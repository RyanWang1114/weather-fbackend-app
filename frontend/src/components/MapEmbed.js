import React from 'react';

const MapEmbed = ({ location }) => {
  const encodedLocation = encodeURIComponent(location);
  const mapSrc = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  
  return (
    <div className="card">
      <h2>Location Map</h2>
      <iframe
        title="Google Map"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapSrc}
      ></iframe>
    </div>
  );
};

export default MapEmbed;