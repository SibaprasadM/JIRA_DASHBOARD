import React, { useState, useEffect } from 'react';
import SprintCountdown from './components/SprintCountdown';
import StatCard from './components/StatCard';
import PieChart from './components/PieChart';
import AssigneeBar from './components/AssigneeBar';
import './App.css';

function App() {
  const [sprint, setSprint] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const sprintRes = await fetch('/api/sprint/active');
      if (!sprintRes.ok) {
        const err = await sprintRes.json();
        throw new Error(err.error || 'Failed to fetch sprint');
      }
      const sprintData = await sprintRes.json();
      setSprint(sprintData);

      const statsRes = await fetch(`/api/sprint/${sprintData.id}/stats`);
      if (!statsRes.ok) {
        const err = await statsRes.json();
        throw new Error(err.error || 'Failed to fetch stats');
      }
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <p className="error-hint">
            Check your .env file has valid JIRA credentials and board ID.
          </p>
          <button onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <SprintCountdown sprint={sprint} />

      <div className="stats-row">
        <StatCard label="Total Stories" value={stats.total} color="#0052CC" />
        <StatCard label="To Do" value={stats.statusCategory['To Do']} color="#4C9AFF" />
        <StatCard label="In Progress" value={stats.statusCategory['In Progress']} color="#FFC400" />
        <StatCard label="Done" value={stats.statusCategory['Done']} color="#36B37E" />
        <StatCard
          label="Story Points"
          value={`${stats.storyPoints.done} / ${stats.storyPoints.total}`}
          color="#6554C0"
        />
      </div>

      <div className="charts-row">
        <PieChart title="Status Breakdown" data={stats.status} palette="status" />
        <PieChart title="Priority Breakdown" data={stats.priority} palette="priority" />
      </div>

      <AssigneeBar assignees={stats.assignees} />
    </div>
  );
}

export default App;
