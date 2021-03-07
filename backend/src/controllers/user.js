const User = require('../models/user');

exports.updateShipping = async (req, res) => {
  const { country, phone, city, address, zip } = req.body;

  const { email } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    { country, phone, city, address, zip },
    { new: true }
  ).exec();

  if (user) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated shipping',
      user,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
};

exports.updateCart = async (req, res) => {
  const { email } = req.user;

  const { cart } = req.body;

  const _cart = await User.findOneAndUpdate({ email }, { cart }, { new: true }).exec();

  if (_cart) {
    res.status(200).json({
      status: 'success',
      message: 'Cart updated',
      _cart,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
};

exports.removeCart = async (req, res) => {
  const { email } = req.user;

  const { productId } = req.data;

  const cart = await User.findOneAndUpdate({ email }, { $pull: { cart: productId } });

  if (cart) {
    res.status(200).json({
      status: 'success',
      message: 'Cart removed',
      cart,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
};

exports.getCart = async (req, res) => {
  const { email } = req.user;

  const cart = await User.findOne({ email }).select('cart').exec();

  if (cart) {
    res.status(200).json({
      status: 'success',
      message: 'Cart found',
      cart,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
};
