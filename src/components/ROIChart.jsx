import React, { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format } from 'date-fns';
import { ThemeContext } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ROIChart = ({ data, scenarios, tgeDate }) => {
  const { darkMode } = useContext(ThemeContext);
  const months = Object.keys(data[scenarios[0]]).map(Number);
  
  const formatMonth = (month) => {
    if (!tgeDate) return `Month ${month}`;
    
    return `Month ${month}`;
  };
  
  const formatDate = (month) => {
    if (!tgeDate) return null;
    
    const date = new Date(tgeDate);
    date.setMonth(date.getMonth() + parseInt(month));
    return format(date, 'MMM yyyy');
  };
  
  // Color palette for scenarios
  const colors = {
    'Bear': { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
    'Base': { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
    'Bull': { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
    // Default colors for additional scenarios
    default: [
      { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
      { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' },
      { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
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
        processedData[scenario][month] = maxValue;
      } else if (value === -Infinity || value < -10000) {
        processedData[scenario][month] = minValue;
      } else {
        processedData[scenario][month] = value;
      }
    });
  });
  
  const chartData = {
    labels: months.map(month => {
      const monthLabel = formatMonth(month);
      const dateLabel = formatDate(month);
      return dateLabel ? [monthLabel, dateLabel] : monthLabel;
    }),
    datasets: scenarios.map((scenario, index) => {
      const colorSet = getColor(scenario, index);
      return {
        label: `${scenario} Scenario`,
        data: months.map(month => processedData[scenario][month]),
        backgroundColor: colorSet.bg,
        borderColor: colorSet.border,
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false
      };
    })
  };
  
  // Add break-even point annotations
  const annotations = {};
  Object.entries(breakEvenPoints).forEach(([scenario, point], index) => {
    const monthIndex = months.indexOf(point.month);
    if (monthIndex !== -1) {
      annotations[`breakEven-${scenario}`] = {
        type: 'point',
        xValue: monthIndex,
        yValue: point.roi,
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        borderWidth: 2,
        radius: 6,
        pointStyle: 'rectRot'
      };
    }
  });
  
  // Get text color based on theme
  const textColor = darkMode ? '#f5f6fa' : '#2d3436';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const zeroLineColor = darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: {
            weight: 'bold'
          }
        }
      },
      title: {
        display: false,
        text: '',
        color: textColor,
        font: {
          size: 14,
          weight: 'normal'
        },
        padding: {
          top: 10,
          bottom: 30
        },
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = data[context.dataset.label.split(' ')[0]][months[context.dataIndex]];
            
            // Handle infinity values in tooltip
            if (value === Infinity) {
              return 'ROI: ∞ (Infinity)';
            } else if (value === -Infinity) {
              return 'ROI: -∞ (-Infinity)';
            }
            
            const label = `ROI: ${(value / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            // Add break-even indicator to tooltip
            const scenario = context.dataset.label.split(' ')[0];
            if (breakEvenPoints[scenario] && breakEvenPoints[scenario].month === months[context.dataIndex]) {
              return [label, '⭐ Break-even point'];
            }
            return label;
          },
          title: function(context) {
            const label = context[0].label;
            // If label is an array (has both month and date), join them with a line break
            return Array.isArray(label) ? label.join('\n') : label;
          }
        },
        backgroundColor: darkMode ? 'rgba(30, 39, 46, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      },
      annotation: {
        annotations: annotations
      }
    },
    scales: {
      y: {
        min: minValue,
        max: maxValue,
        ticks: {
          callback: function(value) {
            return (value / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 });
          },
          color: textColor
        },
        title: {
          display: true,
          text: 'Cumulative ROI (%)',
          color: textColor,
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: function(context) {
            if (context.tick.value === 0) {
              return zeroLineColor;
            }
            return gridColor;
          },
          lineWidth: function(context) {
            if (context.tick.value === 0) {
              return 2; // Thicker line for break-even (0%)
            }
            return 1;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          color: textColor,
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        }
      }
    }
  };
  
  return (
    <div className="roi-chart-container">
      <div className="roi-chart-wrapper">
        <Line data={chartData} options={options} />
        {Object.entries(breakEvenPoints).length > 0 && (
          <div className="break-even-legend-container">
            {Object.entries(breakEvenPoints).map(([scenario, point], index) => (
              <div key={scenario} className="break-even-legend-item">
                <span 
                  className="break-even-legend-marker" 
                  style={{ backgroundColor: getColor(scenario).border }}
                ></span>
                <strong className="break-even-legend-text">{scenario}</strong> breaks even at {formatMonth(point.month)}
                {formatDate(point.month) && (
                  <div className="calendar-date">{formatDate(point.month)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ROIChart;
