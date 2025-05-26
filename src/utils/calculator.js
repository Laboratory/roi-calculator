export const calculateResults = (data) => {
  const {
    investmentAmount,
    tokenPrice,
    tokenName,
    tgeUnlock,
    tgeDate,
    totalSupply,
    tokenAmount,
    priceScenarios,
    unlockPeriods,
    unlockFrequency
  } = data;
  
  // Sort unlock periods by month or week equivalent
  const sortedUnlockPeriods = [...unlockPeriods].sort((a, b) => a.month - b.month);
  
  // Calculate monthly/weekly unlocks
  const maxMonth = sortedUnlockPeriods.length > 0 
    ? sortedUnlockPeriods[sortedUnlockPeriods.length - 1].month 
    : 0;
  
  // For weekly frequency, we need more granular arrays
  // 1 month = ~4.33 weeks
  const isWeekly = unlockFrequency === 'weekly';
  const timeUnitCount = isWeekly 
    ? Math.ceil(maxMonth * 4.33) + 1 // Convert months to weeks and add 1 for TGE
    : maxMonth + 1; // Add 1 for TGE
  
  const unlockAmounts = Array(timeUnitCount).fill(0);
  
  // TGE unlock (time unit 0)
  const tgeUnlockAmount = (Number(tokenAmount) * Number(tgeUnlock)) / 100;
  unlockAmounts[0] = tgeUnlockAmount;
  
  // Other unlock periods
  sortedUnlockPeriods.forEach(period => {
    const unlockAmount = (Number(tokenAmount) * Number(period.percentage)) / 100;
    
    if (isWeekly) {
      // For weekly unlocks, use the weekNumber property if available, otherwise calculate it
      const weekIndex = period.weekNumber 
        ? period.weekNumber 
        : Math.round(period.month * 4.33);
      
      if (weekIndex > 0 && weekIndex < timeUnitCount) {
        unlockAmounts[weekIndex] = unlockAmount;
      }
    } else {
      // For monthly unlocks, use the month directly
      if (period.month > 0) {
        unlockAmounts[period.month] = unlockAmount;
      }
    }
  });
  
  // Calculate revenue for each scenario
  const monthlyRevenue = {};
  const cumulativeROI = {};
  const totalROI = {};
  const breakEvenMonths = {};
  const scenarioROIs = {};
  
  priceScenarios.forEach(scenario => {
    const scenarioPrice = Number(scenario.price);
    const scenarioROI = Number(scenario.roi);
    
    // Store the ROI for each scenario
    scenarioROIs[scenario.name] = scenarioROI;
    
    monthlyRevenue[scenario.name] = Array(timeUnitCount).fill(0);
    cumulativeROI[scenario.name] = Array(timeUnitCount).fill(0);
    
    let cumulativeRevenue = 0;
    let breakEvenFound = false;
    
    for (let timeUnit = 0; timeUnit < timeUnitCount; timeUnit++) {
      const timeUnitRevenue = unlockAmounts[timeUnit] * scenarioPrice;
      monthlyRevenue[scenario.name][timeUnit] = timeUnitRevenue;
      cumulativeRevenue += timeUnitRevenue;
      
      const roi = ((cumulativeRevenue / Number(investmentAmount)) - 1) * 100;
      cumulativeROI[scenario.name][timeUnit] = roi;
      
      // Check for break-even point
      if (!breakEvenFound && roi >= 0) {
        // Convert week to month for consistent reporting if using weekly frequency
        breakEvenMonths[scenario.name] = isWeekly ? (timeUnit / 4.33).toFixed(2) : timeUnit;
        breakEvenFound = true;
      }
    }
    
    totalROI[scenario.name] = cumulativeROI[scenario.name][timeUnitCount - 1];
    
    if (!breakEvenFound) {
      breakEvenMonths[scenario.name] = null;
    }
  });
  
  // Generate FDV warnings if total supply is provided
  const fdvWarnings = [];
  const fdvValues = {};
  
  if (totalSupply && Number(totalSupply) > 0) {
    priceScenarios.forEach(scenario => {
      const fdv = Number(totalSupply) * Number(scenario.price);
      fdvValues[scenario.name] = fdv;
      
      // Add warning if FDV exceeds $500M
      if (fdv > 500000000) { // $500M
        const fdvInBillions = (fdv / 1000000000).toFixed(2);
        fdvWarnings.push({
          scenario: scenario.name,
          message: `${scenario.name} market scenario implies FDV of $${fdvInBillions}B — likely unrealistic for early-stage token.`
        });
      }
    });
  }
  
  return {
    tokenName,
    tokenAmount,
    tokenPrice,
    initialInvestment: Number(investmentAmount),
    tgeDate,
    tgeUnlock,
    unlockPeriods: sortedUnlockPeriods,
    monthlyUnlocks: unlockAmounts,
    monthlyRevenue,
    cumulativeROI,
    totalROI,
    breakEvenMonths,
    fdvWarnings,
    fdvValues,
    totalSupply: Number(totalSupply) || null,
    priceScenarios,
    scenarioROIs,
    unlockFrequency
  };
};
