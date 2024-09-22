let jwt = require('jsonwebtoken');
const config = require('./constants')

let auth = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token == null) {
    return res.status(401).json({
      status: false,
      message: 'Auth token is not supplied'
    });
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = auth