import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLOR_PALETTES = {
  status: ['#4C9AFF', '#FFC400', '#36B37E', '#FF5630', '#6554C0', '#00B8D9'],
  priority: ['#FF5630', '#FF8B00', '#FFC400', '#36B37E', '#6554C0'],
};

function PieChart({ title, data, palette = 'status' }) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const colors = COLOR_PALETTES[palette] || COLOR_PALETTES.status;

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PieChart;
