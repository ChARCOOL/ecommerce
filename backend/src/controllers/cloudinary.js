const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      width: 1664,
      height: 936,
      crop: 'fit',
      format: 'jpg',
      public_id: `${Date.now()}`,
      resource_type: 'image',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully uploaded an image',
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: 'Error while uploading an image',
      err,
    });
  }
};

exports.remove = async (req, res) => {
  const image_id = req.body.public_id;

  try {
    await cloudinary.uploader.destroy(image_id);

    res.status(200).json({
      status: 'success',
      message: 'Successfully removed an image',
    });
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: 'Error while removing an image',
      err,
    });
  }
};
