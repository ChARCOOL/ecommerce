import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined, GoogleOutlined } from '@ant-design/icons';
import { auth, googleProvider } from '../../firebase';
import { toast } from 'react-toastify';
import firebase from 'firebase/app';

import { createOrUpdateUser } from '../../utils/auth';

const { Item } = Form;
const { Password } = Input;

const Login = ({ history }) => {
  const [isLoading, setIsLoading] = useState(null);

  function handleSubmit({ email, password, remember }) {
    setIsLoading(true);

    auth
      .signInWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        createOrUpdateUser((await user.getIdTokenResult()).token);

        setTimeout(() => history.push('/'), 1500);

        toast.success('Successfully logged in redirecting to home page');
        return setIsLoading(false);
      })
      .catch(({ message }) => {
        toast.error(message);
        return setIsLoading(false);
      });

    if (remember) auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    else auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
  }

  function handleGoogle() {
    setIsLoading(true);

    auth
      .signInWithPopup(googleProvider)
      .then(async ({ user }) => createOrUpdateUser((await user.getIdTokenResult()).token))
      .then(() => {
        setTimeout(() => history.push('/'), 1500);

        toast.success('Successfully logged in redirecting to home page');
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
      <Item name="email" rules={[{ required: true, message: 'Please input your email' }]}>
        <Input type="email" prefix={<MailOutlined />} placeholder="Email" />
      </Item>
      <Item
        name="password"
        className="mt-2"
        rules={[{ required: true, message: 'Please input your password' }]}
      >
        <Password type="password" prefix={<LockOutlined />} placeholder="Password" />
      </Item>
      <Row className="mb-4 mt-3">
        <Col span={12}>
          <Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember Me</Checkbox>
          </Item>
        </Col>
        <Col span={12} className="text-right">
          <Link to="/reset-password">Forgot password!</Link>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <Item name="login">
            <Button type="primary" htmlType="submit" icon={<LoginOutlined />} disabled={isLoading}>
              Log in
            </Button>
          </Item>
        </Col>
        <Col span={10} className="text-right">
          <Item name="loginGoogle">
            <Button
              type="text"
              htmlType="button"
              className="bg-danger text-white"
              onClick={handleGoogle}
              icon={<GoogleOutlined />}
              disabled={isLoading}
            >
              Log in with Google
            </Button>
          </Item>
        </Col>
      </Row>
      Don&apos;t have account? <Link to="/register">Register now</Link>
    </Form>
  );
};

export default Login;
