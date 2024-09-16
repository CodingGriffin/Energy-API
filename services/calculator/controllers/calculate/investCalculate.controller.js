const { System } = require("../../../../database/database");

var deliveryCostPercentage = 0.01;
var panelCost = 27000; //R
var emsCost = 9000; //R
var systemLifeYears = 20;
var vatTax = 0.15;
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
function calculateIRR(cashFlows, guess = 0.1) {
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
      throw new Error('Derivative is too small, method failed to converge');
    }

    let newIrr = irr - npvValue / derivative;

    if (Math.abs(newIrr - irr) < tolerance) {
      return newIrr;
    }

    irr = newIrr;
  }

  throw new Error('IRR calculation did not converge');
}

function calculateNPV(rate, cashFlows) {
  return cashFlows.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i), 0);
}

const calculateController = async (req, res) => {
  const systemLifeYears = 20;
  const degradationRate = 0.029;
  try {

    const { id } = req.body;
    const tender_ = await System.findByPk(id);
    const tender = tender_.dataValues;
    const costPerUnit = req.body.costPerUnit ? req.body.costPerUnit : tender.unit_cost_current;

    console.log(tender)
    const initialInvest = tender.system_cost_incl;
    const consumtionPM = tender.monthly_consumption_kwh
    const averageIncomePM = consumtionPM * (costPerUnit - tender.unit_cost_new)
    const firstAnnualIncome = 12 * averageIncomePM;
    // const income = firstAnnualIncome * systemLifeYears;
    // const IRR = calculateIRRConstantCashFlows(initialInvest, firstAnnualIncome, systemLifeYears)

    let efficiency = [1], escalation = [1]
    let annualIncome = [firstAnnualIncome];
    let cashflow = [-initialInvest];
    for (let i = 1; i <= systemLifeYears; i++) {
      efficiency = [...efficiency, efficiency[i - 1] * (1 - degradationRate)]
      escalation = [...escalation, escalation[i - 1] * (1 + 0.025)];
      annualIncome = [...annualIncome, annualIncome[i - 1] * efficiency[i] * escalation[i]];
      cashflow = [...cashflow, cashflow[i - 1] + annualIncome[i]]
    }
    const income = cashflow[cashflow.length - 1] - cashflow[0]
    const IRR = calculateIRR(cashflow)
    const ROI = (income - initialInvest) / initialInvest;
    let paybackPeriod = cashflow.findIndex(val => val > 0);
    paybackPeriod += cashflow[paybackPeriod] / averageIncomePM;
    const NPV = calculateNPV(0.05, cashflow);
    averageUsagePM = efficiency.reduce((acc, val) => acc + val) / efficiency.length * consumtionPM

    const totalCostPanels = tender.total_panels * panelCost;
    const totalCostEms = tender.total_ems * emsCost;

    const hardwareCost = totalCostPanels + totalCostEms
    const kitCost = calculateKitCost(tender.total_panels);
    const deliveryCost = (totalCostPanels + totalCostEms + kitCost) * deliveryCostPercentage;
    const labour = culculateLabourCost(tender.total_panels, tender.total_ems);
    const totalCostExcl = tender.system_cost_excl;
    const VAT = tender.system_cost_excl * vatTax;
    const totalCostIncl = tender.system_cost_incl

    // const result = {
    //   initialInvest,
    //   averageIncomePM,
    //   averageAnnualIncome: firstAnnualIncome,
    //   income,
    //   ROI,
    //   NPV,
    //   IRR,
    //   paybackPeriod,
    //   efficiency,
    //   escalation,
    //   annualIncome,
    //   cashflow
    // }
    const data = {
      "tiles": [
        {
          "id": "1",
          "type": "input",
          "title": "Cost per Unit",
          "display": {
            "min": 1.50,
            "max": 5.50,
            "current": costPerUnit
          }
        },
        {
          "id": "2",
          "type": "display",
          "title": "ROI",
          "display": `${(ROI * 100).toFixed(1)}%`
        },
        {
          "id": "3",
          "type": "display",
          "title": "IRR",
          "display": `${(IRR * 100).toFixed(1)}%`
        },
        {
          "id": "4",
          "type": "display",
          "title": "Consumption per month",
          "display": `${consumtionPM.toFixed(0)} kWh`
        },
        {
          "id": "5",
          "type": "display",
          "title": "Income per month",
          "display": `R ${averageIncomePM.toFixed(2)}`
        },
        {
          "id": "6",
          "type": "table",
          "title": "Investment Details",
          "tableData": [
            {
              "column1": "ROI",
              "column2": `${(ROI * 100).toFixed(1)}%`
            },
            {
              "column1": "IRR",
              "column2": `${(IRR * 100).toFixed(1)}%`
            },
            {
              "column1": "NPV",
              "column2": `R ${NPV.toFixed(2)}`
            },
            {
              "column1": "Payback Period",
              "column2": `${paybackPeriod.toFixed(1)} Years`
            },
            {
              "column1": "Cost Escalation pa",
              "column2": "2.5%"
            },
            {
              "column1": "Avg usage pm",
              "column2": `${Math.floor(averageUsagePM)} kWh`
            },
            {
              "column1": "Avg Income pm",
              "column2": `R${averageIncomePM.toFixed(2)}`
            },
            {
              "column1": "Initial Investment",
              "column2": `R${initialInvest}`
            }
          ]
        },
        {
          "id": "7",
          "type": "display",
          "title": "System Cost",
          "display": `R${tender.system_cost_incl.toFixed(2)}`,
          "tableData": [
            {
              "column1": "Hardware Cost",
              "column2": `R${hardwareCost}`
            },
            {
              "column1": "Kit Cost",
              "column2": `R${kitCost}`
            },
            {
              "column1": "Delivery Cost",
              "column2": `R${deliveryCost}`
            },
            {
              "column1": "Labour",
              "column2": `R${labour}`
            },
            {
              "column1": "Total Cost Excl",
              "column2": `R${Math.floor(totalCostExcl)}`
            },
            {
              "column1": "VAT",
              "column2": `R${Math.floor(VAT)}`
            },
            {
              "column1": "Total Cost Incl",
              "column2": `R${Math.floor(totalCostIncl)}`
            }
          ]
        }
      ]
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/calculator/invest',
  handler: calculateController,
  requiresAuth: false,
  permissions: []
};
