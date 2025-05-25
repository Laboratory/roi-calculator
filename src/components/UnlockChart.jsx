import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UnlockChart = ({ data, tokenName, tgeDate }) => {
  const formatMonth = (month) => {
    if (!tgeDate) return `Month ${month}`;
    
    const date = new Date(tgeDate);
    date.setMonth(date.getMonth() + parseInt(month));
    return `Month ${month} — ${format(date, 'MMM d, yyyy')}`;
  };
  
  const chartData = {
    labels: data.map((_, index) => formatMonth(index)),
    datasets: [
      {
        label: `${tokenName} Tokens Unlocked`,
        data: data,
        backgroundColor: 'rgba(108, 92, 231, 0.7)',
        borderColor: 'rgba(108, 92, 231, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `${tokenName} Unlocked: ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
          },
          title: function(context) {
            return context[0].label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `${tokenName} Tokens`
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    }
  };
  
  return <Bar data={chartData} options={options} />;
};

export default UnlockChart;
