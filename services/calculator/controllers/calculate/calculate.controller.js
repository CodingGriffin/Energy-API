const PANEL_RATING = 500; // W
const SYSTEM_DAILY_POWER_GENERATED_PER_PANEL = 4.5; // kWh/day
const PEAK_POWER_PER_PANEL = 0.5; // kW
const FLOATING_OUTPUT_PER_PANEL = 0.5; // kWh
const BATTERY_CAPACITY_PER_PANEL = 2.5; // kWh

// Costs
const PANEL_COST = 27000; // R per panel
const EMS_COST = 9000; // R per EMS unit
const VAT_RATE = 0.15;
const DELIVERY_PERCENTAGE = 0.01; // 1%

// Investment Parameters
const PANEL_LIFE_EXPECTANCY_YEARS = 20;
const DEGRADATION_RATE = 0.029; // 2.9% per year
const INFLATION_RATE = 0.07; // 7% per year

// Additional Costs Percentages
const MAINTENANCE_PERCENTAGE = 0.05; // 5%
const INSURANCE_PERCENTAGE = 0.01; // 1%
const BREAKAGE_PERCENTAGE = 0.005; // 0.5%
const WARRANTY_FUND_PERCENTAGE = 0.0025; // 0.25%
const DBR_PERCENTAGE = 0.0025; // 0.25%
const SERVICE_CENTER_PERCENTAGE = 0.005; // 0.5%
const ROOF_OWNER_PERCENTAGE = 0.01; // 1%

// Helper Functions

function calculateKitCost(panelsTotal) {
  const costAcCablePerMeter = 300;
  const acCableMetersRequired = 19;

  const costEarthSpike = 150;
  const earthSpikeRequired = 2;

  const costEarthCablePerMeter = 50;
  const earthCableRequired = 10;

  const costRailsClampsPerPanel = 800;

  const acCableCost = costAcCablePerMeter * acCableMetersRequired;
  const earthCableCost = costEarthCablePerMeter * earthCableRequired;
  const earthSpikeCost = costEarthSpike * earthSpikeRequired;

  const baseKitPrice = acCableCost + earthCableCost + earthSpikeCost;

  const railsInstallationCost = panelsTotal * costRailsClampsPerPanel;

  const installationCost = baseKitPrice + railsInstallationCost;

  return installationCost;
}

function calculateLabourCost(panelsTotal, emsTotal) {
  const costLabourPerHour = 750;
  const requiredLabourPerPanel = 0.5;

  const costPowerPackConfigurationPerHour = 750;
  const requiredPowerPackConfigurationPerPanel = 0.25;

  const costEmsConfigurationPerHour = 750;
  const requiredEmsConfigurationPerEMS = 2;

  const cocCostPerEms = 2500;
  const requiredCocPerEms = 1;

  const callOutCost = 950;
  const consumablesCost = 1000;
  const licenseFeeCredits = 1250;
  const installationBaseCost = callOutCost + consumablesCost + licenseFeeCredits;

  const panelInstallationCost =
    costLabourPerHour * requiredLabourPerPanel * panelsTotal;
  const powerpackConfigurationCost =
    costPowerPackConfigurationPerHour *
    requiredPowerPackConfigurationPerPanel *
    panelsTotal;

  const emsConfigurationCost =
    costEmsConfigurationPerHour * requiredEmsConfigurationPerEMS * emsTotal;

  const cocTotalCost = cocCostPerEms * requiredCocPerEms * emsTotal;

  const totalLabourCost =
    installationBaseCost +
    panelInstallationCost +
    powerpackConfigurationCost +
    emsConfigurationCost +
    cocTotalCost;

  return totalLabourCost;
}

function calculateLcoe(initialInvestment, dailyProduction, lifespanYears) {
  let totalCost = initialInvestment;
  let annualProduction = dailyProduction * 365;
  let totalProduction = 0;

  for (let year = 1; year <= lifespanYears; year++) {
    let yearlyProduction =
      annualProduction * Math.pow(1 - DEGRADATION_RATE, year - 1);
    totalProduction += yearlyProduction;
  }

  let lcoe = totalCost / totalProduction;
  return lcoe;
}

// Endpoint Definition

const calculateController = (req, res) => {
  // Extract inputs
  const {
    totalPanels,
    inverterSize,
    monthlyConsumption,
    currentMonthlyCost,
    totalRooms,
    totalDistributionBoards,
  } = req.body;

  // Input Validation
  if (
    !monthlyConsumption ||
    !currentMonthlyCost ||
    !totalRooms ||
    !totalDistributionBoards
  ) {
    return res.status(400).json({
      error:
        'Missing required fields: monthlyConsumption, currentMonthlyCost, totalRooms, totalDistributionBoards.',
    });
  }

  // Initialize variables
  let panelsRequired;
  const powerRequiredPerDay = monthlyConsumption / 30; // kWh/day

  // Determine Panels Required
  if (totalPanels) {
    panelsRequired = totalPanels;
  } else if (inverterSize) {
    panelsRequired = Math.ceil(inverterSize / 2); // Assuming each panel contributes 2 kW
  } else {
    // Calculate panels required from monthly consumption
    panelsRequired = Math.ceil(
      powerRequiredPerDay / SYSTEM_DAILY_POWER_GENERATED_PER_PANEL
    );
  }

  // Calculate EMS Required
  const emsRequired = Math.max(
    totalDistributionBoards,
    Math.ceil(panelsRequired / 12)
  );

  // System Capacity Calculations
  const peakPowerProvided = panelsRequired * PEAK_POWER_PER_PANEL; // kW
  const totalPowerProvidedPerDay =
    panelsRequired * SYSTEM_DAILY_POWER_GENERATED_PER_PANEL; // kWh/day
  const totalFloatingOutput = panelsRequired * FLOATING_OUTPUT_PER_PANEL; // kWh
  const batteryCapacity = panelsRequired * BATTERY_CAPACITY_PER_PANEL; // kWh
  const avgDailyCapacity = totalPowerProvidedPerDay; // kWh/day
  const avgMonthlyCapacity = avgDailyCapacity * 30; // kWh/month

  // Suggested Load Breakdown
  const kettlePower = 2; // kW per kettle
  const televisionPower = 0.15; // kW per TV
  const hotPlatePower = 1.5; // kW per hot plate
  const lightsPower = 0.01; // kW per light

  const maxKettles = Math.floor(peakPowerProvided / kettlePower);
  const maxTelevisions = Math.floor(peakPowerProvided / televisionPower);
  const maxHotPlates = Math.floor(peakPowerProvided / hotPlatePower);
  const maxLights = Math.floor(peakPowerProvided / lightsPower);

  // Financial Calculations
  const currentCostPerUnit = currentMonthlyCost / monthlyConsumption; // R/kWh

  // Hardware Costs
  const totalPP500Cost = panelsRequired * PANEL_COST;
  const totalEMSCost = emsRequired * EMS_COST;
  const totalHardwareCost = totalPP500Cost + totalEMSCost;

  // Kit Cost
  const kitCost = calculateKitCost(panelsRequired);

  // Delivery Cost
  const deliveryCost = DELIVERY_PERCENTAGE * totalHardwareCost;

  // Labour Cost
  const labourCost = calculateLabourCost(panelsRequired, emsRequired);

  // Total Cost Excl. VAT
  const totalCostExclVAT =
    totalHardwareCost + kitCost + deliveryCost + labourCost;

  // VAT
  const vat = VAT_RATE * totalCostExclVAT;

  // Total Cost Incl. VAT
  const totalCostInclVAT = totalCostExclVAT + vat;

  // Investment Breakdown
  const panelLifeExpectancyYears = PANEL_LIFE_EXPECTANCY_YEARS;
  const panelLifeExpectancyMonths = panelLifeExpectancyYears * 12;

  // LCOE
  const lcoe = calculateLcoe(
    totalCostInclVAT,
    avgDailyCapacity,
    panelLifeExpectancyYears
  );

  // Additional Costs per Unit
  const maintenanceCost = lcoe * MAINTENANCE_PERCENTAGE;
  const insuranceCost = lcoe * INSURANCE_PERCENTAGE;
  const breakageCost = lcoe * BREAKAGE_PERCENTAGE;
  const warrantyFundCost = lcoe * WARRANTY_FUND_PERCENTAGE;
  const dbrCost = lcoe * DBR_PERCENTAGE;
  const serviceCenterCost = lcoe * SERVICE_CENTER_PERCENTAGE;
  const roofOwnerCost = lcoe * ROOF_OWNER_PERCENTAGE;

  const sumAdditionalCostsPerUnit =
    maintenanceCost +
    insuranceCost +
    breakageCost +
    warrantyFundCost +
    dbrCost +
    serviceCenterCost +
    roofOwnerCost;

  const newCostPerUnit = lcoe + sumAdditionalCostsPerUnit;

  const vatCostPerUnit = newCostPerUnit * VAT_RATE;

  const newCostPerUnitInclVAT = newCostPerUnit + vatCostPerUnit;

  // Prepare response
  const response = {
    specifications: {
      systemSize: {
        pp500Panels: panelsRequired,
        ems: emsRequired,
      },
      systemCapacity: {
        peakPowerProvided: `${peakPowerProvided.toFixed(2)} kW`,
        totalPowerProvidedPerDay: `${totalPowerProvidedPerDay.toFixed(
          2
        )} kWh`,
        totalFloatingOutput: `${totalFloatingOutput.toFixed(2)} kWh`,
        batteryCapacity: `${batteryCapacity.toFixed(2)} kWh`,
        avgDailyCapacity: `${avgDailyCapacity.toFixed(2)} kWh`,
        avgMonthlyCapacity: `${avgMonthlyCapacity.toFixed(2)} kWh`,
      },
      suggestedLoadBreakdown: {
        kettle: maxKettles,
        television: maxTelevisions,
        hotPlate: maxHotPlates,
        lights: maxLights,
      },
    },
    financials: {
      unitCost: {
        currentCostPerUnit: `R ${currentCostPerUnit.toFixed(2)} per kWh`,
        projectedNewCostPerUnit: `R ${newCostPerUnitInclVAT.toFixed(
          2
        )} per kWh`,
      },
      hardwareCost: {
        totalPP500Cost: `R ${totalPP500Cost.toFixed(2)}`,
        totalEMSCost: `R ${totalEMSCost.toFixed(2)}`,
        totalHardwareCost: `R ${totalHardwareCost.toFixed(2)}`,
        kitCost: `R ${kitCost.toFixed(2)}`,
        deliveryCost: `R ${deliveryCost.toFixed(2)}`,
        labour: `R ${labourCost.toFixed(2)}`,
        totalCostExclVAT: `R ${totalCostExclVAT.toFixed(2)}`,
        vat: `R ${vat.toFixed(2)}`,
        totalCostInclVAT: `R ${totalCostInclVAT.toFixed(2)}`,
      },
      investmentBreakdown: {
        panelLifeExpectancy: {
          years: panelLifeExpectancyYears,
          months: panelLifeExpectancyMonths,
        },
        lcoe: `R ${lcoe.toFixed(4)} per kWh`,
        maintenance: `R ${maintenanceCost.toFixed(4)} per kWh`,
        insurance: `R ${insuranceCost.toFixed(4)} per kWh`,
        breakage: `R ${breakageCost.toFixed(4)} per kWh`,
        warrantyFund: `R ${warrantyFundCost.toFixed(4)} per kWh`,
        dbr: `R ${dbrCost.toFixed(4)} per kWh`,
        serviceCenter: `R ${serviceCenterCost.toFixed(4)} per kWh`,
        roofOwner: `R ${roofOwnerCost.toFixed(4)} per kWh`,
        newCostPerUnit: `R ${newCostPerUnit.toFixed(4)} per kWh`,
        vatCostPerUnit: `R ${vatCostPerUnit.toFixed(4)} per kWh`,
        newCostPerUnitInclVAT: `R ${newCostPerUnitInclVAT.toFixed(
          4
        )} per kWh`,
      },
    },
  };

  // Validation
  if (totalPanels) {
    // If totalPanels is specified, check if it meets the power required per day
    const powerProvidedPerDay =
      panelsRequired * SYSTEM_DAILY_POWER_GENERATED_PER_PANEL;
    if (powerProvidedPerDay < powerRequiredPerDay) {
      response.validation = {
        message: `The specified number of panels (${panelsRequired}) does not meet your daily energy requirements. You may need at least ${Math.ceil(
          powerRequiredPerDay / SYSTEM_DAILY_POWER_GENERATED_PER_PANEL
        )} panels to meet your consumption.`,
      };
    }
  } else if (inverterSize) {
    // If inverterSize is specified, check if the calculated panels meet the power required per day
    const powerProvidedPerDay =
      panelsRequired * SYSTEM_DAILY_POWER_GENERATED_PER_PANEL;
    if (powerProvidedPerDay < powerRequiredPerDay) {
      response.validation = {
        message: `The specified inverter size (${inverterSize} kW) does not meet your daily energy requirements. You may need an inverter size of at least ${(
          Math.ceil(
            powerRequiredPerDay / SYSTEM_DAILY_POWER_GENERATED_PER_PANEL
          ) * 2
        ).toFixed(2)} kW to meet your consumption.`,
      };
    }
  }

  // Send response
  res.json(response);
};


module.exports = {
  method: 'POST',
  path: '/api/calculator/calculate',
  handler: calculateController,
  requiresAuth: false,
  permissions: []
};
