// Assisted using common GitHub development utilities
/* eslint-env browser */
/* global Chart */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.chartData;
  const ctx = document.getElementById('taskChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending', 'Overdue'],
      datasets: [{
        data: [data.completed, data.pending, data.overdue],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  });
  // By Tag
  const byTagDiv = document.getElementById('byTag');
  byTagDiv.innerHTML = '<h2>By Tag</h2>' + Object.entries(data.byTag).map(([tag, count]) => `<div>${tag}: ${count}</div>`).join('');
  // By Due Date
  const byDueDateDiv = document.getElementById('byDueDate');
  byDueDateDiv.innerHTML = '<h2>By Due Date</h2>' + Object.entries(data.byDueDate).map(([date, count]) => `<div>${date}: ${count}</div>`).join('');
});
