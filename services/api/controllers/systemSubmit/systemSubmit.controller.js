const { System } = require("../../../../database/database");

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
		const request = req.body;
		for (i in request) {
			data = request[i];
			console.log(data.props.financials)
			const newSystem = {
				state: "Installation Pending",
				status: data.status,
				lat: data.center.lat,
				long: data.center.lng,
				address_id: i + 1,
				formatted_address: "_____________",
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
				lcoe: CostPU2Number(data.props.financials.investmentBreakdown.lcoe),
				dbr: CostPU2Number(data.props.financials.investmentBreakdown.dbr),
				unit_cost_new: CostPU2Number(data.props.financials.investmentBreakdown.newCostPerUnit),
				unit_cost_current: CostPU2Number(data.props.financials.unitCost.currentCostPerUnit),
				total_panels: data.totalPanels,
				total_ems: data.props.specifications.systemSize.ems,
				ac_cable_quantity: 19,
				ac_cable_cost: 300,
				earth_cable_quantity: 10,
				earth_cable_cost: 50,
				earth_spike_quantity: 2,
				earth_spike_cost: 150,
				rails_clamps_cost: 800,
				rails_clamps_quantity: data.totalPanels,
				// panel_installation:
				// ems_installation: 
				// coc:
				callout: 950,
				consumables: 1000,
				license_fee: 1250,
				system_cost_excl: financial2Number(data.props.financials.hardwareCost.totalCostExclVAT),
				system_cost_incl: financial2Number(data.props.financials.hardwareCost.totalCostInclVAT),
			}
			const res = await System.create(newSystem);
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