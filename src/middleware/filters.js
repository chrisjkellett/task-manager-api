module.exports = async (req, _res, next) => {
  req.filters = {
    createdBy: req.user._id
  };

  if(req.query.done){
    req.filters.done = req.query.done === 'true'
  };

  next();
};