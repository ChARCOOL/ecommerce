import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';

const { Item } = Form;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(null);

  const handleSubmit = ({ email }) => {
    setIsLoading(true);

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        toast.success('Password reset link was send to your email address');
        return setIsLoading(false);
      })
      .catch(({ message }) => {
        toast.error(message);
        return setIsLoading(false);
      });
  };

  return (
    <Form
      onFinish={handleSubmit}
      style={{
        width: '300px',
        margin: 'auto',
        position: 'absolute',
        top: '25%',
        left: '0',
        right: '0',
        bottom: '0',
      }}
    >
      <Item name="email" rules={[{ required: true, message: 'Please input your email' }]}>
        <Input type="email" prefix={<MailOutlined />} placeholder="Email" />
      </Item>
      <Item name="resetPassword">
        <Button type="primary" htmlType="submit" disabled={isLoading}>
          Reset Password
        </Button>
      </Item>
    </Form>
  );
};

export default ResetPassword;
