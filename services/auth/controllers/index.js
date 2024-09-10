module.exports = {
  loginRoute: require('./login/login.controller.js'),
  otpSendRoute: require('./otpSend/otpSend.controller.js'),
  changePasswordRoute: require('./changePassword/changePassword.controller.js'),
  otpResendRoute: require('./otpResend/otpResend.controller.js'),
  otpVerifyRoute: require('./otpVerify/otpVerify.controller.js'),
  logoutRoute: require('./logout/logout.controller.js'),
  registerRoute: require('./register/register.controller.js'),
};