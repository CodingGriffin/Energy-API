const logoutController = (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).json({ message: "Successful token discarded response" });
};

module.exports = {
  method: 'GET',
  path: '/api/auth/logout',
  handler: logoutController,
  requiresAuth: false,
  permissions: []
};
