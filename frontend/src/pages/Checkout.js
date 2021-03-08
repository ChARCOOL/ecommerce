import React, { useRef, useState, useEffect } from 'react';
import { Image, Table, Button } from 'antd';
import { useSelector } from 'react-redux';

import './_checkout.less';

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render(id) {
      return <span style={{ fontSize: 16 }}>{id}</span>;
    },
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render(image) {
      return (
        <Image
          src={image}
          style={{ border: '1px solid #d9d9d9', borderRadius: 10, maxWidth: 200 }}
        />
      );
    },
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render(title) {
      return <span style={{ fontSize: 20 }}>{title}</span>;
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render(price) {
      return <span style={{ fontSize: 20 }}>{price}</span>;
    },
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    rendeR(quantity) {
      return <span style={{ fontSize: 20 }}>{quantity}</span>;
    },
  },
];

const Checkout = () => {
  const { cart } = useSelector((state) => state);

  const total = useRef(0);

  const [data, setData] = useState(null);

  useEffect(() => {
    total.current = 0;

    if (cart) {
      const data = cart.map((cart, idx) => {
        total.current += cart.price;

        return {
          key: idx,
          id: cart.id,
          image: cart.image,
          title: cart.title,
          price: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            cart.price
          ),
          quantity: cart.quantity,
        };
      });

      setData(data);
    }
  }, [cart]);

  const renderFooter = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <Button className="float-left" size="large">
          Continue To Shipping Address
        </Button>
        <span className="float-right" style={{ fontSize: 18, fontWeight: 500 }}>
          {total.current &&
            `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              total.current
            )}`}
        </span>
      </div>
    );
  };

  return (
    <div className="p-3" style={{ margin: 100, border: '1px solid #d9d9d9', borderRadius: 10 }}>
      <Table
        className="checkout-table"
        loading={!data}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 2 }}
        footer={renderFooter}
        bordered
      />
    </div>
  );
};

export default Checkout;
