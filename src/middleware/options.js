module.exports = async (req, _res, next) => {
  if(req.query.limit){
    req.options.limit = parseInt(req.query.limit);
  }

  if(req.query.skip){
    req.options.skip = parseInt(req.query.skip);
  }

  if(req.query.sortBy){
    req.options = {sort: {}};
    req.options.sort = parseSort(req.query.sortBy)
  }
  next();
}

function parseSort(string){
  const parts = string.split(":");
  const field = parts[0];
  const sortMethod = parts[1] === 'desc' ? -1 : 1;
  return {
    [field]: sortMethod
  }
}