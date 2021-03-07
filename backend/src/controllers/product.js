const Product = require('../models/product');
const { ObjectId } = require('mongodb');
const slugify = require('slugify');

exports.create = async (req, res) => {
  req.body.values.slug = slugify(req.body.values.title);

  const { values } = req.body,
    { slug } = values;

  const product = await Product.findOne({ slug }).exec();

  if (product) {
    res.status(400).json({
      status: 'error',
      message: `Product ${product.title} already exists`,
    });
  } else {
    const newProduct = await new Product(values).save();

    res.status(200).json({
      status: 'success',
      message: 'Successfully created new product',
      product: newProduct,
    });
  }
};

exports.read = async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug }).exec();

  if (product) {
    res.status(200).json({
      status: 'success',
      message: `Successfully found product`,
      product,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: `Product not found`,
    });
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { values } = req.body;

  const product = await Product.findOneAndUpdate(
    { slug },
    { values, slug: slugify(values.title) },
    { new: true },
    (err) => {
      if (err && err.code === 11000) {
        return res.status(400).json({
          status: 'error',
          message: `Product '${product.title}' already exists`,
        });
      }
    }
  ).exec();

  if (product) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated product',
      product,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }
};

exports.rating = async (req, res) => {
  const { id, rating, userId } = req.body;

  const product = await Product.findOne({
    _id: ObjectId(id),
    ratings: { $elemMatch: { postedBy: userId } },
  }).exec();

  if (product) {
    res.status(409).json({
      status: 'error',
      message: 'You already added rating to this product',
    });
  } else {
    await Product.updateOne(
      { _id: ObjectId(id) },
      { $push: { ratings: { rating, postedBy: userId } } },
      { new: true }
    ).exec();

    await Product.aggregate([
      { $match: { _id: ObjectId(id) } },
      { $project: { avgRating: { $avg: '$ratings.rating' } } },
      { $merge: 'products' },
    ]).exec();

    res.status(200).json({
      status: 'success',
      message: 'Successfully added rating',
    });
  }
};

exports.search = async (req, res) => {
  const { value } = req.body;

  const products = await Product.find({ $text: { $search: value } }).exec();

  res.status(200).json({
    status: 'success',
    message: 'Successfully found products',
    products,
  });
};

exports.remove = async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOneAndDelete({ slug }).exec();

  if (product) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully removed product',
      product,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: `Product not found`,
    });
  }
};

exports.list = async (req, res) => {
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .populate('category subCategory', 'name slug')
    .exec();

  if (products) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully found all products',
      products,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'No products was found',
    });
  }
};
