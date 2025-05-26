import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { format } from 'date-fns';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';
import { FaInfoCircle } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const UnlockSchedule = ({ results }) => {
  const { darkMode } = useContext(ThemeContext);
  const {
    monthlyUnlocks,
    tokenName,
    tgeDate,
    priceScenarios,
    tokenAmount,
    tgeUnlock
  } = results;
  
  const baseScenario = priceScenarios.find(s => s.name === 'Base') || priceScenarios[0];
  
  const formatMonth = (month) => {
    if (!tgeDate) return `Month ${month}`;
    
    const date = new Date(tgeDate);
    date.setMonth(date.getMonth() + parseInt(month));
    return `Month ${month} — ${format(date, 'MMM d, yyyy')}`;
  };
  
  const formatDate = (month) => {
    if (!tgeDate) return 'Month ' + month;
    
    if (month === 0) return 'TGE — ' + format(new Date(tgeDate), 'MMM d, yyyy');
    
    const date = new Date(tgeDate);
    date.setMonth(date.getMonth() + month);
    return `Month ${month} — ${format(date, 'MMM d, yyyy')}`;
  };
  
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Prepare chart data
  const labels = ['TGE', ...results.unlockPeriods.map(p => formatMonth(p.month))];
  const unlockValues = [tgeUnlock * tokenAmount / 100];
  
  results.unlockPeriods.forEach(period => {
    unlockValues.push(period.percentage * tokenAmount / 100);
  });
  
  // Get text color based on theme
  const textColor = darkMode ? '#f5f6fa' : '#2d3436';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
  const chartData = {
    labels,
    datasets: [
      {
        label: `${tokenName} Unlock %`,
        data: [tgeUnlock, ...results.unlockPeriods.map(p => p.percentage)],
        backgroundColor: 'rgba(138, 43, 226, 0.7)',
        borderColor: 'rgba(138, 43, 226, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage (%)',
          color: textColor
        },
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        }
      },
      x: {
        title: {
          display: true,
          text: 'Period',
          color: textColor
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
  
  // Prepare table data
  const tableData = [
    {
      period: 'TGE',
      time: formatDate(0),
      percentage: tgeUnlock,
      tokens: tgeUnlock * tokenAmount / 100,
      value: tgeUnlock * tokenAmount * baseScenario.price / 100
    }
  ];
  
  results.unlockPeriods.forEach((period, index) => {
    tableData.push({
      period: index + 1,
      time: formatDate(period.month),
      percentage: period.percentage,
      tokens: period.percentage * tokenAmount / 100,
      value: period.percentage * tokenAmount * baseScenario.price / 100
    });
  });
  
  return (
    <div className="unlock-schedule">
      <div className="chart-container" style={{ height: '400px' }}>
        <h3 className="section-title">
          Token Unlock Schedule
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-unlock-schedule-chart">
                This chart visualizes your token's vesting schedule, showing what percentage of your tokens unlocks at each period.
              </Tooltip>
            }
          >
            <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
          </OverlayTrigger>
        </h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      <div className="schedule-details mt-5">
        <h3 className="section-title">
          Unlock Schedule Details
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-unlock-schedule-details">
                This table provides a detailed breakdown of your token's unlock schedule, including exact dates, percentages, and estimated values.
              </Tooltip>
            }
          >
            <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
          </OverlayTrigger>
        </h3>
        <div className="table-responsive">
          <Table striped bordered hover className="monthly-breakdown-table">
            <thead>
              <tr>
                <th>
                  Period
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-period">
                        The unlock period number, with TGE (Token Generation Event) being the initial unlock.
                      </Tooltip>
                    }
                  >
                    <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                  </OverlayTrigger>
                </th>
                <th>
                  Time
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-time">
                        The specific date when tokens will be unlocked. Shows month number if no TGE date was provided.
                      </Tooltip>
                    }
                  >
                    <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                  </OverlayTrigger>
                </th>
                <th>
                  Percentage
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-percentage">
                        The percentage of your total token allocation that unlocks in this period.
                      </Tooltip>
                    }
                  >
                    <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                  </OverlayTrigger>
                </th>
                <th>
                  Tokens Unlocked
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-tokens-unlocked-table">
                        The actual number of tokens that become available in this period based on your total token amount.
                      </Tooltip>
                    }
                  >
                    <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                  </OverlayTrigger>
                </th>
                <th>
                  Value (Base Case)
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-value">
                        The estimated USD value of tokens unlocked in this period, calculated using the Base Case price scenario.
                      </Tooltip>
                    }
                  >
                    <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                  </OverlayTrigger>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                  <td>{row.period === 'TGE' ? 'TGE' : row.period}</td>
                  <td>{row.time}</td>
                  <td>{row.percentage}%</td>
                  <td>{formatNumber(row.tokens)} {tokenName}</td>
                  <td>{formatCurrency(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UnlockSchedule;
