import React from 'react';

function SprintCountdown({ sprint }) {
  const now = new Date();
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);

  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  const elapsed = totalDays - daysLeft;
  const progress = totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 0;

  return (
    <div className="countdown-card">
      <div className="countdown-header">
        <h2>{sprint.name}</h2>
        {sprint.goal && <p className="sprint-goal">{sprint.goal}</p>}
      </div>
      <div className="countdown-stats">
        <div className="countdown-days">
          <span className="days-number">{daysLeft}</span>
          <span className="days-label">days left</span>
        </div>
        <div className="countdown-meta">
          <span>{start.toLocaleDateString()} — {end.toLocaleDateString()}</span>
          <span>{elapsed} of {totalDays} days elapsed</span>
        </div>
      </div>
      <div className="countdown-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-pct">{progress}%</span>
      </div>
    </div>
  );
}

export default SprintCountdown;
