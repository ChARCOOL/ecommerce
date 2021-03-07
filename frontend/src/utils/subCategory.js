import axios from 'axios';

export const createSubCategory = async (name, parent, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'sub-category',
    { name, parent },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getSubCategory = async (slug) => {
  return await axios.get(process.env.REACT_APP_API + `sub-category/${slug}`);
};

export const updateSubCategory = async (slug, name, authtoken) => {
  return await axios.put(
    process.env.REACT_APP_API + `sub-category/${slug}`,
    { name },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const removeSubCategory = async (slug, authtoken) => {
  return await axios.delete(process.env.REACT_APP_API + `sub-category/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const getSubCategories = async () => {
  return await axios.get(process.env.REACT_APP_API + 'sub-categories');
};
