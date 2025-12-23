module.exports = function (req, res, next) {
  const secret = process.env.ADMIN_SECRET || 'please_change';
  const hdr = req.headers['x-admin-secret'];
  if (!hdr || hdr !== secret) return res.status(403).json({ message: 'Forbidden' });
  next();
};