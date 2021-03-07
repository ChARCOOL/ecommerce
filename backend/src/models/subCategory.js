const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Sub category must have a name',
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
    },
    parent: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);
