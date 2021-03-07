import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { List, InputNumber, Button } from 'antd';
import { DeleteOutlined, RightSquareOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { updateCart } from '../utils/user';

const Cart = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const { user, cart } = useSelector((state) => state);

  const [cartState, setCartState] = useState(cart);

  useEffect(() => setCartState(cart), [cart]);

  const handleChange = (id, quantity, originalPrice) => {
    const cartIdx = cartState.findIndex((cart) => cart.id === id);

    if (quantity > cartState[cartIdx].quantity) {
      cartState[cartIdx].price += originalPrice;
    } else if (quantity < cartState[cartIdx].quantity) {
      cartState[cartIdx].price -= originalPrice;
    }

    cartState[cartIdx].quantity = quantity;

    setCartState((cartState) => [...cartState]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Do you really want to remove this product from your cart?')) {
      const cart = cartState.filter((cart) => cart.id !== id);

      setCartState(cart);
    }
  };

  const handlePointerLeave = () => {
    dispatch({
      type: 'ADD_PRODUCT',
      payload: cartState,
    });

    if (user.token) {
      updateCart(cartState, user.token);
    }
  };

  return (
    <>
      <List
        onPointerLeave={handlePointerLeave}
        style={{ overflow: 'auto', maxHeight: 240, width: 300 }}
        dataSource={cartState}
        renderItem={(item) => (
          <List.Item className="position-relative">
            <img
              style={{ width: 75, height: 91.5 }}
              src={item.image}
              alt="product"
              className="rounded img-thumbnail shadow-2-strong ml-2"
            />
            <p className="mb-0 position-absolute" style={{ top: 15, left: 100 }}>
              {item.title}
            </p>
            <div
              className="position-absolute d-flex align-items-center"
              style={{ bottom: 15, left: 100 }}
            >
              <p className="mb-0 mr-2 border rounded p-1">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  item.price
                )}
              </p>
              <InputNumber
                className="w-25 rounded"
                min={1}
                max={item.maxQuantity}
                value={item.quantity}
                onChange={(quantity) => handleChange(item.id, quantity, item.originalPrice)}
              />
              <DeleteOutlined
                onClick={() => handleDelete(item.id)}
                className="float-end position-absolute"
                style={{ cursor: 'pointer', color: '#f5222d', fontSize: 18, right: 15 }}
              />
            </div>
          </List.Item>
        )}
      />
      {cartState[0] && (
        <>
          <hr className="m-0" />
          <div className="text-center" style={{ padding: '12px 0' }}>
            <Button
              style={{ fontSize: 15, width: 150, letterSpacing: 1 }}
              onClick={() => history.push('/checkout')}
            >
              Checkout <RightSquareOutlined className="align-middle" />
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
