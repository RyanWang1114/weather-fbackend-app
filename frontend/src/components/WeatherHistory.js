import React from 'react';

const WeatherHistory = ({ history, onDelete, onExport, onRefresh }) => {
  return (
    <div className="card">
      <h2>Saved Weather Queries</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={onExport}>Export as CSV</button>
        <button onClick={onRefresh}>Refresh</button>
      </div>
      {history.length === 0 ? (
        <p>No saved queries yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Temp (°C)</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id}>
                <td>{item.location}</td>
                <td>{item.start_date || '-'}</td>
                <td>{item.end_date || '-'}</td>
                <td>{item.temperature}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>
                  <button className="danger" onClick={() => onDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeatherHistory;