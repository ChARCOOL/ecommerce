import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Form, Input, List, Spin, Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import './_findandeditproduct.less';

import { getProducts, removeProduct } from '../../../utils/product';

const { Item } = Form;
const { Meta } = Card;

const FindAndEditProduct = () => {
  const { user } = useSelector((state) => state);

  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);

  const [isLoading, setIsLoading] = useState(null);

  if (isLoading !== true && products === null && filteredProducts === null) {
    setIsLoading(true);
  } else if (isLoading === true && products !== null && filteredProducts !== null) {
    setIsLoading(false);
  }

  useEffect(() => {
    getProducts().then(({ data }) => {
      setProducts(data.products);
      setFilteredProducts(data.products);
    });
  }, []);

  const findProduct = ({ target: { value } }) => {
    setFilteredProducts(
      products.filter(({ title }) => title.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const _removeProduct = (slug) => {
    if (user) {
      if (window.confirm('Are you sure ?')) {
        removeProduct(slug, user.token)
          .then(() => getProducts().then(({ data }) => setFilteredProducts(data.products)))
          .catch(({ response: { data } }) => toast.error(data.message));
      }
    }
  };

  let container;
  if (isLoading === false) {
    container = (
      <List
        dataSource={filteredProducts}
        pagination={{ pageSize: 4 }}
        renderItem={(item) => (
          <List.Item
            className="product-list"
            style={{ display: 'inline-flex', marginRight: '50px' }}
          >
            <Card
              style={{ width: '250px', border: '1px solid #d8d8d8', textAlign: 'center' }}
              cover={
                <img
                  alt="product"
                  src={item.images[0].url}
                  style={{ width: '250px', height: '300px', border: '1px solid #d8d8d8' }}
                />
              }
              actions={[
                <Button
                  type="primary"
                  htmlType="button"
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ width: '50%' }}
                  onClick={() => _removeProduct(item.slug)}
                />,
              ]}
            >
              <Meta title={item.title} />
            </Card>
          </List.Item>
        )}
      />
    );
  }

  return (
    <>
      <Form
        layout="inline"
        style={{
          width: '60em',
          justifyContent: 'center',
        }}
      >
        <Item
          name="findProduct"
          label="Find: "
          className="find-and-update"
          style={{ width: '30em' }}
        >
          <Input
            type="text"
            placeholder="Enter product title.."
            onChange={findProduct}
            disabled={isLoading}
          />
        </Item>
      </Form>
      <hr style={{ marginBottom: '0' }} />
      <Spin
        spinning={isLoading}
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
      >
        {container}
      </Spin>
    </>
  );
};

export default FindAndEditProduct;
