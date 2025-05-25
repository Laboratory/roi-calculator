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
    unlockPeriods
  } = data;
  
  // Sort unlock periods by month
  const sortedUnlockPeriods = [...unlockPeriods].sort((a, b) => a.month - b.month);
  
  // Calculate monthly unlocks
  const maxMonth = sortedUnlockPeriods.length > 0 
    ? sortedUnlockPeriods[sortedUnlockPeriods.length - 1].month 
    : 0;
  
  const monthlyUnlocks = Array(maxMonth + 1).fill(0);
  
  // TGE unlock (month 0)
  const tgeUnlockAmount = (Number(tokenAmount) * Number(tgeUnlock)) / 100;
  monthlyUnlocks[0] = tgeUnlockAmount;
  
  // Other unlock periods
  sortedUnlockPeriods.forEach(period => {
    const unlockAmount = (Number(tokenAmount) * Number(period.percentage)) / 100;
    monthlyUnlocks[period.month] = unlockAmount;
  });
  
  // Calculate monthly revenue for each scenario
  const monthlyRevenue = {};
  const cumulativeROI = {};
  const totalROI = {};
  const breakEvenMonths = {};
  
  priceScenarios.forEach(scenario => {
    const scenarioPrice = Number(scenario.price);
    monthlyRevenue[scenario.name] = Array(maxMonth + 1).fill(0);
    cumulativeROI[scenario.name] = Array(maxMonth + 1).fill(0);
    
    let cumulativeRevenue = 0;
    let breakEvenFound = false;
    
    for (let month = 0; month <= maxMonth; month++) {
      const monthRevenue = monthlyUnlocks[month] * scenarioPrice;
      monthlyRevenue[scenario.name][month] = monthRevenue;
      cumulativeRevenue += monthRevenue;
      
      const roi = ((cumulativeRevenue / Number(investmentAmount)) - 1) * 100;
      cumulativeROI[scenario.name][month] = roi;
      
      // Check for break-even point
      if (!breakEvenFound && roi >= 0) {
        breakEvenMonths[scenario.name] = month;
        breakEvenFound = true;
      }
    }
    
    totalROI[scenario.name] = cumulativeROI[scenario.name][maxMonth];
    
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
          message: `${scenario.name} case price implies FDV of $${fdvInBillions}B — likely unrealistic for early-stage token.`
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
    monthlyUnlocks,
    monthlyRevenue,
    cumulativeROI,
    totalROI,
    breakEvenMonths,
    fdvWarnings,
    fdvValues,
    totalSupply: Number(totalSupply) || null,
    priceScenarios
  };
};
