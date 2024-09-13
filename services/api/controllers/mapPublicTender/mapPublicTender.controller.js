const { System } = require("../../../../database/database");

const systemGetController = async (req, res) => {
    try {
        const systems = await System.findAll()
        console.log(systems);
        res.send(systems)
    }
    catch (err) {
        console.log(err)
    }
};

module.exports = {
    method: 'GET',
    path: '/api/system',
    handler: systemGetController,
    requiresAuth: false,
    permissions: []
};