import React from 'react';

function AssigneeBar({ assignees }) {
  const entries = Object.entries(assignees).sort((a, b) => b[1] - a[1]);
  const maxCount = entries.length > 0 ? entries[0][1] : 1;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Workload by Assignee</h3>
      <div className="assignee-list">
        {entries.map(([name, count]) => (
          <div key={name} className="assignee-row">
            <span className="assignee-name">{name}</span>
            <div className="assignee-bar-track">
              <div
                className="assignee-bar-fill"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="assignee-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssigneeBar;
