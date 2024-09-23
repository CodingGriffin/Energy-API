module.exports = {
  flow: function (costPerUnit, consumptionPM, systemCost) {
    const systemLifeYears = 20
    let calculatedData = [];
    const escalationRate = 0.025; // 2.5% per annum
    const degradationRate = 0.029;
    const discountRate = 0.03
    let cumulativePV = 0;
    let cumulativeCF = -systemCost;
    for (let year = 0; year <= systemLifeYears; year++) {
      const currentYear = 2024 + year;
      // Cost per unit with escalation
      const currentCostPerUnit =
        costPerUnit * Math.pow(1 + escalationRate, year);
      // System efficiency with degradation
      const efficiencyFactor = Math.pow(1 - degradationRate, year);
      // Annual energy production
      const annualEnergyProduction =
        consumptionPM * 12 * efficiencyFactor;
      // Annual income
      const annualIncome = annualEnergyProduction * currentCostPerUnit;
      // Maintenance cost (assumed to escalate with inflation)
      const maintenanceCost = 0; // Assuming no maintenance cost as per instructions
      // Total cash flow
      const annualCashFlow =
        year === 0 ? -systemCost : annualIncome - maintenanceCost;
      // Cumulative cash flow
      if (year > 0) {
        cumulativeCF += annualCashFlow;
      }
      // Present value factor
      const presentValueFactor = 1 / Math.pow(1 + discountRate, year);
      const pvOfCashFlow = annualCashFlow * presentValueFactor;
      cumulativePV += pvOfCashFlow;
      calculatedData.push({
        Year: currentYear,
        "Annual CashFlow": annualCashFlow.toFixed(2),
        "Cumulative CashFlow": cumulativeCF.toFixed(2),
        "Present Value Factor": (presentValueFactor * 100).toFixed(2) + "%",
        "PV Of CashFlow": pvOfCashFlow.toFixed(2),
        "Cumulative PV": cumulativePV.toFixed(2),
      });
    }
    return calculatedData;
  },

  calculateIRR: function (cashFlows, guess = 0.1) {
    const maxIterations = 1000;
    const tolerance = 1e-6;
    let irr = guess;

    function npv(rate) {
      return cashFlows.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i), 0);
    }

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let npvValue = npv(irr);
      if (Math.abs(npvValue) < tolerance) {
        return irr;
      }

      // Calculate derivative of NPV for Newton-Raphson method
      let derivative = cashFlows.reduce((acc, val, i) => acc - i * val / Math.pow(1 + irr, i + 1), 0);

      if (Math.abs(derivative) < tolerance) {
        return 0;
        // throw new Error('Derivative is too small, method failed to converge');
      }

      let newIrr = irr - npvValue / derivative;

      if (Math.abs(newIrr - irr) < tolerance) {
        return newIrr;
      }

      irr = newIrr;
    }

    return "-";
  }
}