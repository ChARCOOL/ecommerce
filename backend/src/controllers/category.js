const Category = require('../models/category');
const slugify = require('slugify');

exports.create = async (req, res) => {
  const { name } = req.body;

  const category = await Category.findOne({ name }).exec();

  if (!category) {
    const newCategory = await new Category({
      name,
      slug: slugify(name),
    }).save();

    res.status(200).json({
      status: 'success',
      message: 'Successfully created new category',
      category: newCategory,
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: `Category '${category.name}' already exists`,
    });
  }
};

exports.read = async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug }).populate('child').exec();

  if (category) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully found category',
      category,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: `Category not found`,
    });
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name } = req.body;

  const category = await Category.findOneAndUpdate(
    { slug },
    { name, slug: slugify(name) },
    { new: true }
  ).exec();

  if (category) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated category',
      category,
    });
  } else {
    res.status(200).json({
      status: 'error',
      message: 'Category not found',
    });
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOneAndDelete({ slug }).exec();

  if (category) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully removed category',
      category,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: `Category not found`,
    });
  }
};

exports.list = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec();

  if (categories) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully found all categories',
      categories,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'No categories was found',
    });
  }
};
