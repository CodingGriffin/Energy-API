let jwt = require('jsonwebtoken');
const config = require('./constants')

let auth = (requiresAuth, req, res, next) => {
  console.log(requiresAuth)
  console.log(req.headers)
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token == null) {
    return res.json({
      status: false,
      message: 'Auth token is not supplied'
    });
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret_key, (err, decoded) => {
      if (err) {
        return res.json({
          status: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = auth