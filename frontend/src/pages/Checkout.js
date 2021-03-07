import React, { useState, useEffect } from 'react';
import { Image, List, Spin, Card } from 'antd';
import { useSelector } from 'react-redux';

const { Item } = List;

const Checkout = () => {
  const { cart } = useSelector((state) => state);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (cart) {
      setData(cart);
    }
  }, [cart]);

  if (data) {
    return (
      <Card className="d-table p-2" style={{ margin: 'auto', marginTop: 100, marginBottom: 100 }}>
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={(item) => (
            <Item className="d-flex justify-content-between align-items-center">
              <Image
                src={item.image}
                alt="product"
                style={{ minWidth: 150, width: '10vw', border: '1px solid #f0f0f0' }}
              />
              <div
                className="d-flex flex-column justify-content-evenly align-items-center"
                style={{ width: '100%', height: '100%' }}
              >
                <h4>{item.title}</h4>
                <span>Quantity: {item.quantity}</span>
                <span>Price: {item.price}</span>
              </div>
            </Item>
          )}
        />
      </Card>
    );
  } else {
    return <Spin spinning={!data} />;
  }
};

export default Checkout;
