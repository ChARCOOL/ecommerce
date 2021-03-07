const SubCategory = require('../models/subCategory');
const slugify = require('slugify');

exports.create = async (req, res) => {
  const { name, parent } = req.body;

  const subCategory = await SubCategory.findOne({ name }).exec();

  if (!subCategory) {
    const newSubCategory = await new SubCategory({
      name,
      slug: slugify(name),
      parent,
    }).save();

    res.status(200).json({
      status: 'success',
      message: 'Successfully created new sub category',
      subCategory: newSubCategory,
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: `Sub category '${subCategory.name}' already exists`,
    });
  }
};

exports.read = async (req, res) => {
  const { slug } = req.params;

  const subCategory = await SubCategory.findOne({ slug }).exec();

  if (subCategory) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully found sub category',
      subCategory,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: `Sub category not found`,
    });
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { slug },
    { name, slug: slugify(name) },
    (err) => {
      if (err && err.code === 11000) {
        return res.status(400).json({
          status: 'error',
          message: `Sub category '${name}' already exists`,
        });
      }
    },
    { new: true }
  ).exec();

  if (subCategory) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated sub category',
      subCategory,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Sub category not found',
    });
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;

  const subCategory = await SubCategory.findOneAndDelete({ slug }).exec();

  if (subCategory) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully removed sub category',
      subCategory,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: `Sub category not found`,
    });
  }
};

exports.list = async (req, res) => {
  const subCategories = await SubCategory.find({})
    .sort({ createdAt: -1 })
    .populate('parent', 'name slug')
    .exec();

  if (subCategories) {
    res.status(200).json({
      status: 'success',
      message: 'Successfully found all sub categories',
      subCategories,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'No sub categories was found',
    });
  }
};
