const { System } = require("../../../../database/database");

const systemSubmitController = async (req, res) => {
    const data = req.body;
    try {
        await System.create({
            ...data
        }).then(result => {
            res.send(result)
            console.log(result)
        })
    }
    catch (err) {
        console.log(err)
    }
};

module.exports = {
    method: 'POST',
    path: '/api/system/submit',
    handler: systemSubmitController,
    requiresAuth: false,
    permissions: []
};