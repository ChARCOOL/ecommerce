import React, { useEffect, useState } from 'react';
import { getProducts } from '../utils/product';
import { Card } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Meta } = Card;

const Home = () => {
  const history = useHistory();

  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(null);

  if (isLoading !== true && products[0] === undefined) setIsLoading(true);
  else if (isLoading === true && products[0] !== undefined) setIsLoading(false);

  useEffect(() => {
    getProducts().then(({ data }) => setProducts(data.products));
  }, []);

  const handleClick = (slug) => {
    history.push(`/product/${slug}`);
  };

  return (
    <div className="p-5 d-flex" style={{ justifyContent: 'space-evenly' }}>
      {products &&
        products.map((product) => (
          <Card
            className="d-table"
            hoverable
            key={product._id}
            style={{ width: 250 }}
            cover={
              <img
                style={{ border: '1px solid #f0f0f0', borderBottom: 0 }}
                alt="product"
                src={product.images[0].url}
              />
            }
            onClick={() => handleClick(product.slug)}
            actions={[
              <div
                key="addToCart"
                role="presentation"
                className="d-flex justify-content-center align-items-center"
                style={{ fontSize: 20 }}
              >
                <span>
                  <EyeOutlined className="mr-2" />
                </span>
                <p className="mb-0">{'View product'}</p>
              </div>,
            ]}
          >
            <Meta
              style={{ textAlign: 'center', fontSize: '20px' }}
              title={<p style={{ fontSize: '20px', marginBottom: 0 }}>{product.title}</p>}
              description={product.description}
            />
          </Card>
        ))}
    </div>
  );
};

export default Home;
