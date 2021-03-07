import axios from 'axios';

export const uploadImage = async (image, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'upload-image',
    { image },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const removeImage = async (public_id, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'remove-image',
    { public_id },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const createProduct = async (values, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'product',
    { values },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getProduct = async (slug) => {
  return await axios.get(process.env.REACT_APP_API + `product/${slug}`);
};

export const updateProduct = async (slug, values, authtoken) => {
  return await axios.put(
    process.env.REACT_APP_API + `product/${slug}`,
    { values },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const addRating = async (id, rating, userId, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'add-rating',
    { id, rating, userId },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const searchProduct = async (value) => {
  return await axios.post(process.env.REACT_APP_API + 'search-product', { value });
};

export const removeProduct = async (slug, authtoken) => {
  return await axios.delete(process.env.REACT_APP_API + `product/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const getProducts = async () => {
  return await axios.get(process.env.REACT_APP_API + 'products');
};
