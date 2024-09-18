const { ServiceCenter } = require('')

const serviceCenterSubmitController = (req, res) => {
  try {
    const data = req.body;
    data.serviceCenters.forEach(async sc => {
      await ServiceCenter.create({
        zone: sc,
        user_id: req.user.id
      })
    });
    res.json({
      message: "Success"
    });
  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/service-center/submit',
  handler: serviceCenterSubmitController,
  requiresAuth: false,
  permissions: []
};