exports.retailerOnly = (req, res, next) => {
  if (req.user.role !== 'retailer') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

exports.buyerOnly = (req, res, next) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
