import React from 'react';

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-value" style={{ color: color || '#172b4d' }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default StatCard;
