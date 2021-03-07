import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { getProduct } from '../utils/product';
import { getCart } from '../utils/user';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Carousel, Spin, Rate } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart } from '../utils/user';
import { addRating } from '../utils/product';

import './_product.less';

const Product = () => {
  const params = useParams();

  const history = useHistory();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state);

  const cartRef = useRef(null);

  const [product, setProduct] = useState(null);

  const [isLoading, setIsLoading] = useState(null);

  if (isLoading !== true && product === null) setIsLoading(true);
  else if (isLoading === true && product !== null) setIsLoading(false);

  useEffect(() => {
    getProduct(params[0])
      .then(({ data }) => setProduct(data.product))
      .catch(({ response }) => response.status >= 400 && history.push('/'));

    if (user) {
      getCart(user.token).then(({ data: { cart } }) => (cartRef.current = cart.cart));
    }
  }, [params]);

  const handleClick = () => {
    if (user) {
      const cartIdx = cartRef.current.findIndex((cart) => cart.title === product.title);

      if (cartIdx !== -1) {
        cartRef.current[cartIdx].quantity += 1;
        cartRef.current[cartIdx].price += cartRef.current[cartIdx].originalPrice;
      } else {
        cartRef.current.push({
          id: product._id,
          title: product.title,
          image: product.images[0].url,
          price: product.price,
          quantity: 1,
          originalPrice: product.price,
          maxQuantity: product.quantity,
        });
      }

      dispatch({
        type: 'ADD_PRODUCT',
        payload: cartRef.current,
      });

      updateCart(cartRef.current, user.token);
    } else {
      return toast.error('You need to be logged in to purchase this product!');
    }
  };

  const handleChange = (rating) => {
    if (user) {
      addRating(product._id, rating, user._id, user.token);
    }
  };

  if (isLoading === false) {
    return (
      <div
        className="d-flex text-center justify-content-center"
        style={{ width: '100%', minHeight: '75vh', padding: '15vh 10vw' }}
      >
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ width: '25vw' }}
        >
          <Carousel autoplay>
            {product.images.map((image) => (
              <img src={image.url} alt="product" key={image.public_id} />
            ))}
          </Carousel>
        </div>
        <Card
          className="product-card"
          style={{
            fontSize: '1.45vw',
            width: '30vw',
          }}
        >
          <h2 className="mb-0" style={{ fontSize: '1.45vw' }}>
            {product.title}
          </h2>
          <p className="mb-0" style={{ color: 'grey' }}>
            {product.description}
          </p>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ lineHeight: 0.9 }}
          >
            <Rate
              className="pr-3"
              allowHalf
              value={product.avgRating}
              onChange={handleChange}
              style={{ fontSize: 26 }}
            />
            {product.avgRating && (
              <span className="pl-3 font-weight-light" style={{ fontSize: 22 }}>
                {product.avgRating}/5
              </span>
            )}
          </div>
          <div className="d-flex justify-content-around align-items-center">
            <div>
              <button className="purchase-button" onClick={handleClick}>
                <ShoppingCartOutlined /> Purchase
              </button>
            </div>
            <span>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                product.price
              )}
            </span>
          </div>
        </Card>
      </div>
    );
  } else {
    return (
      <Spin
        spinning={true}
        className="text-center m-auto position-absolute"
        size="large"
        style={{
          width: 10,
          height: 10,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    );
  }
};

export default Product;
