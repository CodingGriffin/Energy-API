const { System } = require("../../../../database/database");

const systemSubmitController = async (req, res) => {
	try {
		const data = req.body;
		const res = await System.create({...data});
		return res.status(200).json({ ...res });
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