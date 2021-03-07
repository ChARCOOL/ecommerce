const cartReducer = (state = null, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return action.payload;
    default:
      return state;
  }
};

export default cartReducer;
