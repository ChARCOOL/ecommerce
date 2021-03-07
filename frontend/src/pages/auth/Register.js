import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import axios from 'axios';

const { Item } = Form;

const email_already_exists = async (email) => {
  return await axios.post(
    process.env.REACT_APP_API + 'email-already-exists',
    {},
    {
      headers: {
        email,
      },
    }
  );
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(null);

  async function handleSubmit({ email }) {
    setIsLoading(true);

    window.localStorage.removeItem('emailForSignIn');

    const {
      data: { message },
    } = await email_already_exists(email);

    if (message) {
      toast.error(message);
      return setIsLoading(false);
    }

    const actionCodeSettings = {
      url: `${window.location.origin}/register/complete`,
      handleCodeInApp: true,
    };

    auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);

        toast.success('Check your email address to continue registration');
        return setIsLoading(false);
      })
      .catch(({ message }) => {
        toast.error(message);
        return setIsLoading(false);
      });
  }

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
      <Item
        name="email"
        className="mt-2"
        rules={[{ required: true, message: 'Please enter your email address' }]}
      >
        <Input type="email" placeholder="Email" prefix={<MailOutlined />} />
      </Item>
      <Item name="register" className="mt-3">
        <Button type="primary" htmlType="submit" disabled={isLoading}>
          Register
        </Button>
      </Item>
      Already have an account? <Link to="/login">Login now</Link>
    </Form>
  );
};

export default Register;
