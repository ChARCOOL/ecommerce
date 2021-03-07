const User = require('../models/user');
const admin = require('../firebase');

exports.authCheck = async (req, res, next) => {
  const { name, authtoken } = req.headers;

  try {
    const firebaseUser = await admin.auth().verifyIdToken(authtoken);

    req.user = { name, ...firebaseUser };

    next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser && adminUser.role !== 'admin') {
    res.status(403).json({
      status: 'error',
      message: 'User is not an admin',
    });
  } else {
    next();
  }
};
