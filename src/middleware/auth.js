const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const credentials = jwt.verify(token, process.env.AUTHORISATION_SIGNATURE);
    const user = await User.findOne({_id: credentials.id, 'tokens.token': token});
    
    if(!user){
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  }

  catch (e) {
    res.status(401).send({error: 'invalid token'});
  }
};