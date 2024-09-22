const { System } = require("../../../../database/database");
const calc = require("../../../../common/calc")
function CostPU2Number(input) {
	let str = input.slice(2);
	str = str.slice(0, -8)
	console.log(str)
	return Number(str);
}

function financial2Number(input) {
	let str = input.slice(2)
	return Number(str)
}

const systemSubmitController = async (req, res) => {
	try {
		const request = req.body.systems;
		for (i in request) {
			data = request[i];
			const flow = calc.flow(CostPU2Number(data.calData.financials.unitCost.currentCostPerUnit), data.monthlyConsumption, financial2Number(data.calData.financials.hardwareCost.totalCostInclVAT));
			const irr = calc.calculateIRR(flow.map(el => el["Annual CashFlow"]))
			console.log(flow.map(el => el["Annual CashFlow"]))
			const roi = flow[flow.length - 1]["Cumulative CashFlow"] / financial2Number(data.calData.financials.hardwareCost.totalCostInclVAT)
			console.log(flow[flow.length - 1]["Cumulative CashFlow"])
			const newSystem = {
				state: "Installation Pending",
				status: data.status,
				lat: data.center.lat,
				long: data.center.lng,
				address_id: 1,
				formatted_address: "123 Main St, Johannesburg, South Africa",
				monthly_consumption_kwh: data.monthlyConsumption,
				percentage_degredation: 0.029,
				percentage_escalation: 0.025,
				percentage_system_owner: 0.02,
				percentage_roof_owner: 0.01,
				percentage_service_center: 0.005,
				percentage_maintenance: 0.05,
				percentage_insurance: 0.01,
				percentage_breakage: 0.005,
				percentage_warranty: 0.0025,
				lcoe: CostPU2Number(data.calData.financials.investmentBreakdown.lcoe),
				irr,
				roi,
				dbr: CostPU2Number(data.calData.financials.investmentBreakdown.dbr),
				unit_cost_new: CostPU2Number(data.calData.financials.investmentBreakdown.newCostPerUnit),
				unit_cost_current: CostPU2Number(data.calData.financials.unitCost.currentCostPerUnit),
				total_panels: data.totalPanels,
				total_ems: data.calData.specifications.systemSize.ems,
				ac_cable_quantity: 19,
				ac_cable_cost: 300,
				earth_cable_quantity: 10,
				earth_cable_cost: 50,
				earth_spike_quantity: 2,
				earth_spike_cost: 150,
				rails_clamps_cost: 800,
				rails_clamps_quantity: data.totalPanels,
				callout: 950,
				consumables: 1000,
				license_fee: 1250,
				system_cost_excl: financial2Number(data.calData.financials.hardwareCost.totalCostExclVAT),
				system_cost_incl: financial2Number(data.calData.financials.hardwareCost.totalCostInclVAT),
			}
			await System.create(newSystem);
		}
		return res.status(200).json({ message: "success" });
	}
	catch (err) {
		console.log(err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = {
	method: 'POST',
	path: '/api/system/submit',
	handler: systemSubmitController,
	requiresAuth: false,
	permissions: []
};