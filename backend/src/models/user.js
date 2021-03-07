const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    picture: String,
    email: {
      type: String,
      index: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    cart: {
      type: Array,
      default: [],
    },
    country: String,
    phone: String,
    city: String,
    address: String,
    zip: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
