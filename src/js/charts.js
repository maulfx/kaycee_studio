/**
 * Kaycee Studio Pro - Interactive Analytics Charts
 * Built with Chart.js with Cyberpunk Neon Themes
 */

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let viewsTrendChartInstance = null;
let audienceDistChartInstance = null;
let revenueChartInstance = null;

// Custom neon styling options
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

export function initCharts(data, activeAccount = 'all') {
  renderViewsTrendChart(data, activeAccount);
  renderAudienceDistributionChart(data, activeAccount);
}

/**
 * Render 14-Day TikTok Views Comparison Trend Chart
 */
export function renderViewsTrendChart(data, activeAccount = 'all') {
  const ctx = document.getElementById('viewsTrendChart');
  if (!ctx) return;

  if (viewsTrendChartInstance) {
    viewsTrendChartInstance.destroy();
  }

  const accounts = data.accounts || {};
  const accountList = Object.values(accounts);

  if (accountList.length === 0) {
    // If no accounts, show placeholder
    viewsTrendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [{
          label: 'Menunggu Akun Terhubung',
          data: [0, 0, 0, 0],
          borderColor: '#64748b',
          borderDash: [5, 5]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    return;
  }

  const labels = [
    '01 Okt', '02 Okt', '03 Okt', '04 Okt', '05 Okt', '06 Okt', '07 Okt',
    '08 Okt', '09 Okt', '10 Okt', '11 Okt', '12 Okt', '13 Okt', '14 Okt'
  ];

  const baseScales = [0.8, 0.9, 1.1, 0.85, 1.3, 1.5, 1.2, 0.95, 1.4, 1.8, 1.6, 2.0, 1.7, 1.9];
  const colorPalette = ['#00f2fe', '#ff0050', '#a855f7', '#10b981', '#f59e0b', '#3b82f6'];

  let datasets = [];

  accountList.forEach((acc, idx) => {
    if (activeAccount !== 'all' && activeAccount !== acc.id) return;

    const baseVal = Math.max(10, Math.round((acc.totalViewsMonth || 100000) / 30 / 1000));
    const viewsData = baseScales.map(scale => Math.round(baseVal * scale));
    const color = acc.accentColor || colorPalette[idx % colorPalette.length];

    datasets.push({
      label: `${acc.handle} (Views)`,
      data: viewsData,
      borderColor: color,
      backgroundColor: color + '15',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: color,
      pointBorderColor: '#070a12',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 7
    });
  });

  viewsTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            font: { size: 12, weight: '600' },
            color: '#cbd5e1'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(14, 20, 36, 0.95)',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          borderColor: 'rgba(255, 255, 255, 0.12)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}K views`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: {
            color: '#64748b',
            font: { size: 11 },
            callback: value => value + 'K'
          }
        }
      }
    }
  });
}

/**
 * Render Audience / Category Share Doughnut Chart
 */
export function renderAudienceDistributionChart(data, activeAccount = 'all') {
  const ctx = document.getElementById('audienceDistChart');
  if (!ctx) return;

  if (audienceDistChartInstance) {
    audienceDistChartInstance.destroy();
  }

  const accounts = data.accounts || {};
  const accountList = Object.values(accounts);

  if (accountList.length === 0) {
    audienceDistChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Menunggu Akun'],
        datasets: [{ data: [100], backgroundColor: ['#334155'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    return;
  }

  let labels = [];
  let values = [];
  let colors = [];
  const colorPalette = ['#00f2fe', '#ff0050', '#a855f7', '#10b981', '#f59e0b', '#3b82f6'];

  if (activeAccount === 'all' && accountList.length > 1) {
    // Show distribution between accounts
    labels = accountList.map(a => a.handle);
    values = accountList.map(a => a.totalViewsMonth || a.followers || 1);
    colors = accountList.map((a, i) => a.accentColor || colorPalette[i % colorPalette.length]);
  } else {
    // Single account focus: category breakdown
    const targetAcc = accounts[activeAccount] || accountList[0];
    labels = [`${targetAcc.category || 'Utama'} (Fokus)`, 'Highlight & Tips', 'Kolaborasi / Sponsor', 'Lainnya'];
    values = [52, 24, 16, 8];
    colors = [targetAcc.accentColor || '#00f2fe', '#4facfe', '#a855f7', '#334155'];
  }

  audienceDistChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#0e1424',
          borderWidth: 3,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            font: { size: 11, weight: '500' },
            color: '#94a3b8',
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: 'rgba(14, 20, 36, 0.95)',
          padding: 10,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              return ` ${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}
