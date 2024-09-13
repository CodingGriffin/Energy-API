const { System } = require("../../../../database/database");

const tenderGetController = async (req, res) => {
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
    handler: tenderGetController,
    requiresAuth: false,
    permissions: []
};