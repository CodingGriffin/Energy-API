function calculateKitCost(panelsTotal) {
  var costAcCablePerMeter = 300;
  var acCableMetersRequired = 19;

  var costEarthSpike = 150;
  var earthSpikeRequired = 2;

  var costEarthCablePerMeter = 50;
  var earthCableRequired = 10;

  var costRailsClampsPerPanel = 800;

  var acCableCost = costAcCablePerMeter * acCableMetersRequired;
  var earthCableCost = costEarthCablePerMeter * earthCableRequired;
  var earthSpikeCost = costEarthSpike * earthSpikeRequired;

  var baseKitPrice = acCableCost + earthCableCost + earthSpikeCost;

  var railsInstallationCost = panelsTotal * costRailsClampsPerPanel;

  var installationCost = baseKitPrice + railsInstallationCost;

  return installationCost;
}

function culculateLabourCost(panelsTotal, emsTotal) {
  var costLabourPerHour = 750;
  var requiredLabourPerPanel = 0.5;

  var costPowerPackConfigurationPerHour = 750;
  var requiredPowerPackConfigurationPerPanel = 0.25;

  var costEmsConfigurationPerHour = 750;
  var requiredEmsConfigurationPerEMS = 2;

  var cocCostPerEms = 2500;
  var requiredCocPerEms = 1;

  var callOutCost = 950;
  var consumablesCost = 1000;
  var licenseFeeCredits = 1250;
  var installationBaseCost = callOutCost + consumablesCost + licenseFeeCredits;

  var panelInstallationCost = costLabourPerHour * requiredLabourPerPanel * panelsTotal;
  var powerpackConfigurationCost = costPowerPackConfigurationPerHour * requiredPowerPackConfigurationPerPanel * panelsTotal;

  var emsConfigurationCost = costEmsConfigurationPerHour * requiredEmsConfigurationPerEMS * emsTotal;

  var cocTotalCost = cocCostPerEms * requiredCocPerEms * emsTotal;

  var totalLabourCost = installationBaseCost + panelInstallationCost + powerpackConfigurationCost + emsConfigurationCost + cocTotalCost;

  return totalLabourCost;
}

function calculateLcoe(initialInvestment, dailyProduction, lifespan) {
  let totalCost = initialInvestment;
  let annualProduction = dailyProduction * 365;
  let totalProduction = 0;

  const degradationRate = 0.029;
  const inflationRate = 0.07;

  for (let year = 1; year <= lifespan; year++) {
      let yearlyProduction = annualProduction * Math.pow((1 - degradationRate), year - 1);
      totalProduction += yearlyProduction;
  }

  let lcoe = totalCost / totalProduction;
  return lcoe;
}

const calculateController = (req, res) => {

  const msg = { payload: req.body };

  var totalConsumption = parseFloat(msg.payload.totalConsumption);
  var totalCost = parseFloat(msg.payload.totalCost);
  var totalRooms = parseFloat(msg.payload.totalRooms);
  var totalBoards = parseFloat(msg.payload.totalBoards);

  var panelRating = 500; //W
  var sunlightHoursDaily = 8; //hours
  var panelEfficiency = 0.7; //%

  var totalMaxOutputPerPanel = 2.5; //kW
  var batteryPower = 2500; //W
  var systemDailyPowerGenerated = 4.5; //kW
  var maxPowerGeneratedDaily = 5; //kW

  var powerRequiredPerRoom = 2.5; //kW
  var powerProvidedPerPanelInstant = 2.5; //kW
  var floatingPanelOutput = .5; //kW

  var panelCost = 27000; //R
  var emsCost = 9000; //R
  var deliveryCostPercentage = 0.01;
  var vatTax = 0.15;

  var powerRequiredPerDay = totalConsumption / 30;

  var panelsRequired = Math.ceil(powerRequiredPerDay / systemDailyPowerGenerated);
  var emsRequired = Math.ceil(panelsRequired / 12);

  var currentUnitCost = totalCost / totalConsumption;
  var peakPowerRequired = totalRooms * powerRequiredPerRoom;
  var peakPowerProvidedBySystem = panelsRequired * powerProvidedPerPanelInstant;
  var totalPowerProvidedPerDay = panelsRequired * systemDailyPowerGenerated;
  var totalFlaotingOutputOfSystem = panelsRequired * floatingPanelOutput;
  var maxPowerOutputOfSystem = panelsRequired * totalMaxOutputPerPanel;
  var maxPeakOutputDeficit = maxPowerOutputOfSystem - peakPowerRequired;

  var totalCostPanels = panelsRequired * panelCost;
  var totalCostEms = emsRequired * emsCost;

  var costKit = calculateKitCost(panelsRequired);

  var deliveryCost = (totalCostPanels + totalCostEms + costKit) * deliveryCostPercentage;

  var labourCost = culculateLabourCost(panelsRequired, emsRequired);

  var totalCostExcl = totalCostPanels + totalCostEms + costKit + deliveryCost + labourCost;
  var vatCost = totalCostExcl * vatTax;
  var totalCostIncl = totalCostExcl + vatCost;

  var systemLifeYears = 20;
  var lcoe = calculateLcoe(totalCostIncl, (maxPowerGeneratedDaily * panelsRequired), systemLifeYears);

  var networkMaintenancePercentage = 0.08;
  var networkMaintenanceCostPerUnit = networkMaintenancePercentage * lcoe;

  var warrantyFundPercentage = 0.05;
  var warrantyFundCostPerUnit = warrantyFundPercentage * lcoe;

  var serviceCenterPercentage = 0.05;
  var serviceCenterCostPerUnit = serviceCenterPercentage * lcoe;

  var roofOwnerPercentage = 0.05;
  var roofOwnerCostPerUnit = roofOwnerPercentage * lcoe;

  var dbrCostPerUnit = lcoe + networkMaintenanceCostPerUnit + warrantyFundCostPerUnit + serviceCenterCostPerUnit + roofOwnerCostPerUnit;

  var systemOwnerMarkup = 0.5;
  var systemOwnerMarkupCostPerUnit = systemOwnerMarkup * dbrCostPerUnit;

  var newCostPerUnit = dbrCostPerUnit + systemOwnerMarkupCostPerUnit;
  var vatCostPerUnit = vatTax * newCostPerUnit;

  var newCostPerUnitIncl = newCostPerUnit + vatCostPerUnit;

  var result = {
      panelsRequired: panelsRequired,
      emsRequired: emsRequired,
      currentUnitCost: currentUnitCost,
      powerRequiredPerDay: powerRequiredPerDay,
      peakPowerRequiredPerRoom: peakPowerRequired,
      peakPowerProvidedBySystem: peakPowerProvidedBySystem,
      totalPowerProvidedPerDay: totalPowerProvidedPerDay,
      totalFlaotingOutputOfSystem: totalFlaotingOutputOfSystem,
      maxPowerOutputOfSystem: maxPowerOutputOfSystem,
      maxPeakOutputDeficit: maxPeakOutputDeficit,
      panelCost: panelCost,
      emsCost: emsCost,
      totalCostPanels: totalCostPanels,
      totalCostEms: totalCostEms,
      costKit: calculateKitCost(panelsRequired),
      costLabour: labourCost,
      deliveryCost: deliveryCost,
      totalCostExcl: totalCostExcl,
      vatCost: vatCost,
      totalCostIncl: totalCostIncl,
      systemLifeYears: systemLifeYears,
      systemLifeMonths: (systemLifeYears * 12),
      lcoe: lcoe,
      networkMaintenanceCostPerUnit: networkMaintenanceCostPerUnit,
      warrantyFundCostPerUnit: warrantyFundCostPerUnit,
      serviceCenterCostPerUnit: serviceCenterCostPerUnit,
      roofOwnerCostPerUnit: roofOwnerCostPerUnit,
      dbrCostPerUnit: dbrCostPerUnit,
      systemOwnerMarkupCostPerUnit: systemOwnerMarkupCostPerUnit,
      newCostPerUnit: newCostPerUnit,
      vatCostPerUnit: vatCostPerUnit,
      newCostPerUnitIncl: newCostPerUnitIncl
  };

  res.json(result);
};

module.exports = {
  method: 'POST',
  path: '/api/calculator/calculate',
  handler: calculateController,
  requiresAuth: false,
  permissions: []
};
