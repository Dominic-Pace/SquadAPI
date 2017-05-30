import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKEN_TIME = 60 * 60 * 24 * 365; //1 Year
const SECRET = "S42fSp1qe250M9vWVsx4h12uB";

let authenticate = expressJwt({ secret: SECRET });
let generateAccessToken = (req,res, next) => {
  req.token = req.token || {};
  req.token = jwt.sign({
    id: req.user.id,
  }, SECRET, {
    expiresIn: TOKEN_TIME // 1 Year
  });
  next();
};

let respond = (req, res) => {
  res.status(200).json({
    status: 'Success!',
    message: 'User authenticated successfully.',
    token: req.token
  });
};

module.exports = {
  authenticate,
  generateAccessToken,
  respond
};
