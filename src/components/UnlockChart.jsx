import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UnlockChart = ({ data, tokenName, tgeDate }) => {
  const { t } = useTranslation('unlockschedule');
  
  const formatMonth = (month) => {
    if (!tgeDate) return t('chart.periodLabels.month', { month });
    
    const date = new Date(tgeDate);
    date.setMonth(date.getMonth() + parseInt(month));
    return t('chart.periodLabels.monthWithDate', { 
      month, 
      date: format(date, 'MMM d, yyyy') 
    });
  };
  
  const chartData = {
    labels: data.map((_, index) => formatMonth(index)),
    datasets: [
      {
        label: t('chart.labels.tokenUnlocked', { tokenName }),
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
            return t('chart.labels.tokensUnlocked', { 
              tokenName, 
              value: value.toLocaleString(undefined, { maximumFractionDigits: 2 }) 
            });
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
          text: t('chart.labels.period')
        }
      }
    }
  };
  
  return <Bar data={chartData} options={options} />;
};

export default UnlockChart;
