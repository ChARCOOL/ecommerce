import React, { useState } from 'react';
import { Menu, Card } from 'antd';

import UpdateShipping from './UpdateShipping';
import ResetEmail from './ResetEmail';
import ResetPassword from './ResetPassword';

const { Item } = Menu;

const UserDashboard = () => {
  const [selectedKey, setSelectedKey] = useState('updateShipping');

  return (
    <>
      <Menu
        selectedKeys={selectedKey}
        onSelect={(e) => setSelectedKey(e.key)}
        mode="inline"
        style={{
          width: '15em',
          margin: '5em 7.5em',
          paddingRight: '2em',
          borderRight: '2px solid #1890FF',
        }}
      >
        <Item key="updateShipping">Update Shipping</Item>
        <Item key="resetEmail">Reset Email</Item>
        <Item key="resetPassword">Reset Password</Item>
      </Menu>
      <Card
        className="d-table position-absolute"
        style={{
          top: '8em',
          left: '30em',
          border: '2px solid #1890FF',
          backgroundColor: '#fbfbf8',
        }}
      >
        {(() => {
          switch (selectedKey) {
            case 'updateShipping':
              return <UpdateShipping />;
            case 'resetEmail':
              return <ResetEmail />;
            case 'resetPassword':
              return <ResetPassword />;
            default:
              return null;
          }
        })()}
      </Card>
    </>
  );
};

export default UserDashboard;
