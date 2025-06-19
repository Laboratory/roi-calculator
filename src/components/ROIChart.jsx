import React, { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format } from 'date-fns';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ROIChart = ({ data, scenarios, tgeDate, unlockFrequency = 'monthly', fdvValues, totalSupply }) => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation(['calculator', 'common']);
  
  // Add null checks to prevent errors when data is missing or scenarios is empty
  if (!data || !scenarios || scenarios.length === 0 || !data[scenarios[0]]) {
    return (
      <div className="chart-error-container text-center p-4">
        <p>{t('calculator:results.monthlyBreakdown.noChartData')}</p>
      </div>
    );
  }
  
  const months = Object.keys(data[scenarios[0]]).map(Number);
  
  const formatTimeUnit = (timeUnit) => {
    const isWeekly = unlockFrequency === 'weekly';
    
    if (!tgeDate) {
      return isWeekly ? t('calculator:results.monthlyBreakdown.tableColumns.period.weekTitle', { number: timeUnit }) : t('calculator:results.monthlyBreakdown.tableColumns.period.title', { number: timeUnit });
    }
    
    return isWeekly ? t('calculator:results.monthlyBreakdown.tableColumns.period.weekTitle', { number: timeUnit }) : t('calculator:results.monthlyBreakdown.tableColumns.period.title', { number: timeUnit });
  };
  
  const formatDate = (timeUnit) => {
    if (!tgeDate) return null;
    
    const date = new Date(tgeDate);
    
    if (unlockFrequency === 'weekly') {
      // Add weeks (approximately 7 days per week)
      date.setDate(date.getDate() + (timeUnit * 7));
      return format(date, 'MMM dd, yyyy');
    } else {
      // Add months
      date.setMonth(date.getMonth() + parseInt(timeUnit));
      return format(date, 'MMM yyyy');
    }
  };
  
  // Color palette for scenarios
  const colors = {
    'Bear': { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
    'Base': { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
    'Bull': { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
    'FDV': { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
    // Default colors for additional scenarios
    default: [
      { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
      { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' },
      { bg: 'rgba(199, 199, 199, 0.2)', border: 'rgba(199, 199, 199, 1)' }
    ]
  };
  
  const getColor = (scenario, index) => {
    if (colors[scenario]) return colors[scenario];
    return colors.default[index % colors.default.length];
  };
  
  // Find break-even points for each scenario
  const breakEvenPoints = {};
  scenarios.forEach(scenario => {
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const roi = data[scenario][month];
      if (roi >= 0 && (i === 0 || data[scenario][months[i-1]] < 0)) {
        breakEvenPoints[scenario] = { month, roi };
        break;
      }
    }
  });
  
  // Find max and min values for better scaling
  let maxValue = -Infinity;
  let minValue = Infinity;
  
  scenarios.forEach(scenario => {
    months.forEach(month => {
      const value = data[scenario][month];
      // Skip Infinity or extremely large values for max calculation
      if (value !== Infinity && value < 10000) {
        maxValue = Math.max(maxValue, value);
      }
      // Skip -Infinity or extremely small values for min calculation
      if (value !== -Infinity && value > -10000) {
        minValue = Math.min(minValue, value);
      }
    });
  });
  
  // Add some padding to the max/min
  maxValue = Math.ceil(maxValue * 1.1);
  minValue = Math.floor(minValue * 1.1);
  
  // Ensure we always show the 0 line
  if (minValue > 0) minValue = 0;
  if (maxValue < 0) maxValue = 0;
  
  // Process data to handle Infinity values
  const processedData = {};
  scenarios.forEach(scenario => {
    processedData[scenario] = {};
    months.forEach(month => {
      const value = data[scenario][month];
      if (value === Infinity || value > 10000) {
        // Cap extremely high values
        processedData[scenario][month] = 10000;
      } else if (value === -Infinity || value < -10000) {
        // Cap extremely low values
        processedData[scenario][month] = -10000;
      } else {
        processedData[scenario][month] = value;
      }
    });
  });

  // Add FDV threshold line if FDV data is available
  let fdvThresholdData = null;
  if (fdvValues && totalSupply) {
    // Calculate FDV threshold line (e.g., when FDV reaches $500M)
    const fdvThreshold = 500000000; // $500M
    fdvThresholdData = months.map(month => {
      // Calculate what ROI would be needed to reach the FDV threshold
      // This is a reference line showing when investment would be "overvalued"
      const avgFdv = Object.values(fdvValues).reduce((sum, val) => sum + val, 0) / Object.values(fdvValues).length;
      if (avgFdv > fdvThreshold) {
        return (fdvThreshold / avgFdv - 1) * 100; // ROI adjustment needed
      }
      return 0; // Threshold line at 0% if FDV is reasonable
    });
  }
  
  // Prepare dataset for Chart.js
  const chartData = {
    labels: months.map(month => {
      const formattedTimeUnit = formatTimeUnit(month);
      const formattedDate = formatDate(month);
      
      if (formattedDate) {
        return `${formattedTimeUnit}\n(${formattedDate})`;
      }
      
      return formattedTimeUnit;
    }),
    datasets: [
      ...scenarios.map((scenario, index) => {
        const color = getColor(scenario, index);
        
        return {
          label: scenario === 'Bear' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bear') :
                 scenario === 'Base' ? t('calculator:results.monthlyBreakdown.scenarioLabels.base') :
                 scenario === 'Bull' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bull') : scenario,
          data: months.map(month => processedData[scenario][month]),
          borderColor: color.border,
          backgroundColor: color.bg,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2
        };
      }),
      ...(fdvThresholdData ? [{
        label: t('calculator:results.monthlyBreakdown.fdvThreshold', 'FDV Threshold ($500M)'),
        data: fdvThresholdData,
        borderColor: colors['FDV'].border,
        backgroundColor: colors['FDV'].bg,
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5]
      }] : [])
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#f8f9fa' : '#212529',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const scenarioName = context.dataset.label;
            const value = context.raw;
            const formattedValue = value.toFixed(2);
            
            // Mark break-even points
            const month = months[context.dataIndex];
            if (breakEvenPoints[scenarioName] && breakEvenPoints[scenarioName].month === month) {
              return `${scenarioName}: ${formattedValue}% (${t('calculator:results.monthlyBreakdown.breakEven')})`;
            }
            
            return `${scenarioName}: ${formattedValue}%`;
          },
          title: (tooltipItems) => {
            const month = months[tooltipItems[0].dataIndex];
            const formattedTimeUnit = formatTimeUnit(month);
            const formattedDate = formatDate(month);
            
            if (formattedDate) {
              return `${formattedTimeUnit} (${formattedDate})`;
            }
            
            return formattedTimeUnit;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#f8f9fa' : '#212529',
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        min: minValue,
        max: maxValue,
        ticks: {
          color: darkMode ? '#f8f9fa' : '#212529',
          font: {
            size: 11
          },
          callback: (value) => `${value}%`
        },
        title: {
          display: true,
          text: 'ROI (%)',
          color: darkMode ? '#f8f9fa' : '#212529'
        }
      }
    }
  };
  
  // Add custom annotation for break-even points
  if (Object.keys(breakEvenPoints).length > 0) {
    chartOptions.plugins.annotation = {
      annotations: Object.entries(breakEvenPoints).map(([scenario, { month, roi }], index) => {
        const color = getColor(scenario, index).border;
        const monthIndex = months.findIndex(m => m === month);
        
        return {
          type: 'point',
          xValue: monthIndex,
          yValue: roi,
          backgroundColor: color,
          borderColor: 'white',
          borderWidth: 2,
          radius: 5,
          label: {
            content: t('calculator:results.monthlyBreakdown.breakEven'),
            enabled: false
          }
        };
      })
    };
  }
  
  return (
    <div className="roi-chart-container" style={{ height: '400px', marginBottom: '2rem' }}>
      <h4 className="chart-title text-center mb-3">{t('calculator:results.monthlyBreakdown.chartTitle')}</h4>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ROIChart;
