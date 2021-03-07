const User = require('../models/user');

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate({ email }, { name, picture }, { new: true }).exec();

  if (!user) {
    const newUser = await new User({
      name,
      picture,
      email,
    }).save();

    res.status(200).json({
      status: 'success',
      message: 'Successfully created new user',
      user: newUser,
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated user',
      user,
    });
  }
};

exports.currentUser = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email }).exec();

  if (user) {
    res.status(200).json({
      status: 'success',
      message: 'User was found',
      user,
    });
  }
};

exports.emailAlreadyExists = async (req, res) => {
  const { email } = req.headers;

  const user = await User.findOne({ email }).exec();

  if (user) {
    res.status(200).json({
      status: 'success',
      message: 'This email address is already associated, please provide a different email address',
    });
  }
};

exports.resetEmail = async (req, res) => {
  const { email, newemail } = req.headers;

  const user = await User.findOneAndUpdate({ email }, { email: newemail }, { new: true }).exec();

  if (user) {
    res.status(200).json({
      status: 'success',
      message: 'User was found',
      user,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'User was not found',
    });
  }
};
