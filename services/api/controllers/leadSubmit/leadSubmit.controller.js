const calculateController = (req, res) => {

  res.json({
    message: "Success"
  });
};

module.exports = {
  method: 'POST',
  path: '/api/lead/submit',
  handler: calculateController,
  requiresAuth: false,
  permissions: []
};