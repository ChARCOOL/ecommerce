import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import axios from 'axios';

const { Item } = Form;
const { Password } = Input;

const createOrUpdateUser = async (name, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'create-or-update-user',
    {},
    {
      headers: {
        name,
        authtoken,
      },
    }
  );
};

const RegisterComplete = ({ history }) => {
  const [isLoading, setIsLoading] = useState(null);

  const email = window.localStorage.getItem('emailForSignIn');

  if (!email) history.push('/');

  function handleSubmit({ name, email, password }) {
    setIsLoading(true);

    if (auth.isSignInWithEmailLink(window.location.href)) {
      auth
        .signInWithEmailLink(email, window.location.href)
        .then(async ({ user }) => {
          user.updatePassword(password);

          createOrUpdateUser(name, (await user.getIdTokenResult()).token);

          window.localStorage.removeItem('emailForSignIn');

          toast.success('Successfully completed registration');
          return setIsLoading(false);
        })
        .catch(({ message }) => {
          toast.error(message);
          return setIsLoading(false);
        });
    } else {
      toast.error('Email link token is modified or expired');
      return setIsLoading(false);
    }
  }

  return (
    <Form
      onFinish={handleSubmit}
      initialValues={{ email }}
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
        name="name"
        rules={[
          { required: true, message: 'Please enter your full name' },
          { pattern: /^([ .]?\.?[a-zA-Z]+)+$/g, message: 'Full name must contain only letters' },
        ]}
      >
        <Input type="text" placeholder="Full name" prefix={<UserOutlined />} />
      </Item>
      <Item
        name="email"
        className="mt-2"
        rules={[{ required: true, message: 'Please enter your email address' }]}
      >
        <Input type="email" placeholder="Email" prefix={<MailOutlined />} disabled />
      </Item>
      <Item
        name="password"
        className="mt-2"
        rules={[
          { required: true, message: 'Please enter your password' },
          { min: 8, message: 'Password must have atleast 8 characters' },
        ]}
      >
        <Password
          type="password"
          placeholder="Password"
          prefix={<LockOutlined />}
          visibilityToggle
        />
      </Item>
      <Item
        name="confirmPassword"
        className="mt-2"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (
                getFieldValue('password') &&
                getFieldValue('password').length !== 0 &&
                getFieldValue('password') !== value
              ) {
                return Promise.reject("The passwords you entered don't match");
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Password
          type="password"
          placeholder="Confirm password"
          prefix={<LockOutlined />}
          visibilityToggle
        />
      </Item>
      <Item name="register" className="mt-2">
        <Button type="primary" htmlType="submit" disabled={isLoading}>
          Complete Register
        </Button>
      </Item>
    </Form>
  );
};

export default RegisterComplete;
