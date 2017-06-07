require ('dotenv').config();
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKEN_TIME = 60 * 60 * 24 * 365; //1 Year

let authenticate = expressJwt({ secret: process.env.SECRET });
let generateAccessToken = (req,res, next) => {
  req.token = req.token || {};
  req.token = jwt.sign({
    id: req.user.id,
  }, process.env.SECRET, {
    expiresIn: TOKEN_TIME // 1 Year
  });
  next();
};

let respond = (req, res) => {
  let returnedUser = req.user.toObject();

  delete returnedUser.salt
  delete returnedUser.hash
  delete returnedUser.__v

  res.status(200).json({
    status: 'Success!',
    message: 'User authenticated successfully.',
    data:{
      token: req.token,
      user: returnedUser
    }
  });
};

module.exports = {
  authenticate,
  generateAccessToken,
  respond
};
