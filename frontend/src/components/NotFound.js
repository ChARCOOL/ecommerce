import React from 'react';
import { Alert } from 'antd';

const NotFound = () => {
  return (
    <Alert
      type="error"
      message="404 Path Not Found"
      style={{
        fontSize: '24px',
        textAlign: 'center',
        width: '525px',
        height: '100px',
        margin: 'auto',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
      }}
    />
  );
};

export default NotFound;
