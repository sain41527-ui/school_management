import React from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ChartProps {
  darkMode: boolean;
}

export const AttendanceOverviewChart: React.FC<ChartProps> = ({ darkMode }) => {
  const textColor = darkMode ? '#94A3B8' : '#64748B';
  const gridColor = darkMode ? 'rgba(51, 65, 85, 0.45)' : 'rgba(226, 232, 240, 0.8)';

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Present (%)',
        data: [95.4, 96.2, 94.8, 97.1, 95.9],
        backgroundColor: '#4F46E5',
        borderRadius: 6,
        barThickness: 18,
      },
      {
        label: 'Late (%)',
        data: [2.8, 2.1, 3.0, 1.8, 2.4],
        backgroundColor: '#0EA5E9',
        borderRadius: 6,
        barThickness: 18,
      },
      {
        label: 'Absent (%)',
        data: [1.8, 1.7, 2.2, 1.1, 1.7],
        backgroundColor: '#F59E0B',
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: textColor,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, family: 'DM Sans' },
        },
      },
      tooltip: {
        backgroundColor: darkMode ? '#0F172A' : '#1E293B',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } },
      },
    },
  };

  return (
    <div className="h-[260px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export const MonthlyRevenueChart: React.FC<ChartProps> = ({ darkMode }) => {
  const textColor = darkMode ? '#94A3B8' : '#64748B';
  const gridColor = darkMode ? 'rgba(51, 65, 85, 0.45)' : 'rgba(226, 232, 240, 0.8)';

  const data = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Collected ($k)',
        data: [78, 84, 112, 128, 134, 146],
        borderColor: '#0D9488',
        backgroundColor: darkMode ? 'rgba(13, 148, 136, 0.18)' : 'rgba(13, 148, 136, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#0D9488',
      },
      {
        label: 'Pending ($k)',
        data: [14, 11, 18, 12, 9, 8.4],
        borderColor: '#6366F1',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#6366F1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: textColor,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, family: 'DM Sans' },
        },
      },
      tooltip: {
        backgroundColor: darkMode ? '#0F172A' : '#1E293B',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } },
      },
    },
  };

  return (
    <div className="h-[260px] w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export const StudentPerformanceChart: React.FC<ChartProps & { labels?: string[]; scores?: number[] }> = ({
  darkMode,
  labels = ['AP Physics', 'Calculus', 'Literature', 'Data Structures', 'Biology'],
  scores = [94, 91, 89, 96, 90],
}) => {
  const textColor = darkMode ? '#94A3B8' : '#64748B';
  const gridColor = darkMode ? 'rgba(51, 65, 85, 0.45)' : 'rgba(226, 232, 240, 0.8)';

  const data = {
    labels,
    datasets: [
      {
        label: 'Score (%)',
        data: scores,
        backgroundColor: ['#4F46E5', '#2563EB', '#0EA5E9', '#0D9488', '#8B5CF6'],
        borderRadius: 6,
        barThickness: 26,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#0F172A' : '#1E293B',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } },
      },
    },
  };

  return (
    <div className="h-[240px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
};
