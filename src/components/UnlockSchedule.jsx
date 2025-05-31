import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { format } from 'date-fns';
import { Table, OverlayTrigger, Tooltip, Card, Alert } from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const UnlockSchedule = ({ data }) => {
  const { t } = useTranslation(['unlockschedule', 'common']);
  const { darkMode } = useContext(ThemeContext);
  
  // Add a check for missing data
  if (!data) {
    return (
      <div className="unlock-schedule-container">
        <Alert variant="warning">
          {t('common:general.noData')}
        </Alert>
      </div>
    );
  }
  
  // Add null checks for the destructured properties
  const {
    monthlyUnlocks = {},
    tokenName = 'Token',
    tgeDate,
    priceScenarios = [],
    tokenAmount = 0,
    tgeUnlock = 0,
    unlockFrequency = 'monthly',
    unlockPeriods = []
  } = data;
  
  const baseScenario = priceScenarios && Array.isArray(priceScenarios) 
    ? (priceScenarios.find(s => s.name === 'Base') || priceScenarios[0])
    : { price: 0, name: 'Base' };
  
  const formatMonth = (month) => {
    if (!tgeDate) {
      return data.unlockFrequency === 'weekly' 
        ? t('chart.periodLabels.week', { week: month }) 
        : t('chart.periodLabels.month', { month });
    }
    
    const date = new Date(tgeDate);
    if (data.unlockFrequency === 'weekly') {
      date.setDate(date.getDate() + (month * 7));
      return t('chart.periodLabels.weekWithDate', { 
        week: month, 
        date: format(date, 'MMM d, yyyy') 
      });
    } else {
      date.setMonth(date.getMonth() + parseInt(month));
      return t('chart.periodLabels.monthWithDate', { 
        month, 
        date: format(date, 'MMM d, yyyy') 
      });
    }
  };
  
  const formatDate = (month) => {
    if (!tgeDate) {
      return data.unlockFrequency === 'weekly' 
        ? t('chart.periodLabels.week', { week: month }) 
        : t('chart.periodLabels.month', { month });
    }
    
    if (month === 0) return t('chart.periodLabels.tge', { date: format(new Date(tgeDate), 'MMM d, yyyy') });
    
    const date = new Date(tgeDate);
    if (data.unlockFrequency === 'weekly') {
      date.setDate(date.getDate() + (month * 7));
      return t('chart.periodLabels.weekWithDate', { 
        week: month, 
        date: format(date, 'MMM d, yyyy') 
      });
    } else {
      date.setMonth(date.getMonth() + month);
      return t('chart.periodLabels.monthWithDate', { 
        month, 
        date: format(date, 'MMM d, yyyy') 
      });
    }
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
  const labels = data.unlockPeriods && Array.isArray(data.unlockPeriods) 
    ? ['TGE', ...data.unlockPeriods.map(p => formatMonth(p.month))]
    : ['TGE'];
    
  const unlockValues = [tgeUnlock * tokenAmount / 100];
  
  if (data.unlockPeriods && Array.isArray(data.unlockPeriods)) {
    data.unlockPeriods.forEach(period => {
      unlockValues.push(period.percentage * tokenAmount / 100);
    });
  }
  
  const chartData = {
    labels,
    datasets: [
      {
        label: `${tokenName || 'Token'} Unlock %`,
        data: data.unlockPeriods && Array.isArray(data.unlockPeriods) 
          ? [tgeUnlock, ...data.unlockPeriods.map(p => p.percentage)]
          : [tgeUnlock],
        backgroundColor: 'rgba(138, 43, 226, 0.7)',
        borderColor: 'rgba(138, 43, 226, 1)',
        borderWidth: 1,
      }
    ]
  };
  
  // Get text color based on theme
  const textColor = darkMode ? '#f5f6fa' : '#2d3436';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
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
  
  if (data.unlockPeriods && Array.isArray(data.unlockPeriods)) {
    data.unlockPeriods.forEach((period, index) => {
      let timeValue;
      if (data.unlockFrequency === 'weekly') {
        // For weekly frequency, use the weekNumber property if available
        const weekIndex = period.weekNumber ? period.weekNumber : Math.round(period.month * 4.33);
        timeValue = formatDate(weekIndex);
      } else {
        timeValue = formatDate(period.month);
      }
      
      tableData.push({
        period: index + 1,
        time: timeValue,
        percentage: period.percentage,
        tokens: period.percentage * tokenAmount / 100,
        value: period.percentage * tokenAmount * baseScenario.price / 100
      });
    });
  }
  
  return (
    <div className="unlock-schedule">
      <Card className="mb-4">
        <Card.Header>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-unlock-schedule-chart">
                {t('chart.tooltip')}
              </Tooltip>
            }
          >
            <div className="d-flex align-items-center tooltip-label">
              <h5 className="mb-0">{t('chart.title')}</h5>
              <FaInfoCircle className="ms-2 text-primary info-icon" />
            </div>
          </OverlayTrigger>
        </Card.Header>
        <div className="chart-container" style={{ height: '400px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Card>
      
      <div className="schedule-details mt-5">
        <Card className="mb-4">
          <Card.Header>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-unlock-schedule-details">
                  {t('details.tooltip')}
                </Tooltip>
              }
            >
              <div className="d-flex align-items-center tooltip-label">
                <h5 className="mb-0">{t('details.title')}</h5>
                <FaInfoCircle className="ms-2 text-primary info-icon" />
              </div>
            </OverlayTrigger>
          </Card.Header>
          <div className="table-responsive">
            <Table striped bordered hover className="monthly-breakdown-table">
              <thead>
                <tr>
                  <th>
                    {t('details.columns.period.title')}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-period">
                          {t('details.columns.period.tooltip')}
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </th>
                  <th>
                    {t('details.columns.time.title')}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-time">
                          {t('details.columns.time.tooltip')}
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </th>
                  <th>
                    {t('details.columns.percentage.title')}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-percentage">
                          {t('details.columns.percentage.tooltip')}
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </th>
                  <th>
                    {t('details.columns.tokens.title')}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-tokens">
                          {t('details.columns.tokens.tooltip')}
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </th>
                  <th>
                    {t('details.columns.value.title')}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-value">
                          {t('details.columns.value.tooltip')}
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
                    <td>{formatNumber(row.tokens)} {tokenName || 'Token'}</td>
                    <td>{formatCurrency(row.value)}</td>
                  </tr>
                ))}
                <tr className="table-primary fw-bold">
                  <td colSpan={2}>{t('summary.totalRow')}</td>
                  <td>
                    {formatNumber(
                      tableData.reduce((sum, row) => sum + row.percentage, 0)
                    )}%
                  </td>
                  <td>
                    {formatNumber(
                      tableData.reduce((sum, row) => sum + row.tokens, 0)
                    )}
                  </td>
                  <td>
                    {formatCurrency(
                      tableData.reduce((sum, row) => sum + row.value, 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UnlockSchedule;
