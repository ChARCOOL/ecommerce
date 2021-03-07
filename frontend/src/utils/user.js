import axios from 'axios';

export const updateCart = async (cart, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'update-cart',
    { cart },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getCart = async (authtoken) => {
  return await axios.get(process.env.REACT_APP_API + 'get-cart', {
    headers: {
      authtoken,
    },
  });
};

export const removeCart = async (productId, authtoken) => {
  return await axios.delete(process.env.REACT_APP_API + 'remove-cart', {
    headers: {
      authtoken,
    },
    data: {
      productId,
    },
  });
};
