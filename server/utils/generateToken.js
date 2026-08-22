const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campusfix_super_secret_jwt_key_2026_engineering_college', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
