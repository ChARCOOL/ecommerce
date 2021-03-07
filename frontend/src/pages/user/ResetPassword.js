import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

import { currentUser } from '../../utils/auth';

const { Item } = Form;
const { Password } = Input;

const ResetPassword = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(null);

  const handleSubmit = ({ password }) => {
    setIsLoading(true);

    auth.onAuthStateChanged((user) => {
      if (user) {
        user
          .updatePassword(password)
          .then(async () => {
            const token = (await user.getIdTokenResult()).token;

            currentUser(token).then((res) => {
              dispatch({
                type: 'LOGGED_IN',
                payload: {
                  name: res.data.user.name,
                  picture: res.data.user.picture,
                  email: res.data.user.email,
                  token,
                  role: res.data.user.role,
                  _id: res.data.user._id,
                  country: res.data.user.country,
                  phone: res.data.user.phone,
                  city: res.data.user.city,
                  address: res.data.user.address,
                  zip: res.data.user.zip,
                },
              });
            });
          })
          .then(() => {
            toast.success('You successfully updated your password');
            return setIsLoading(false);
          })
          .catch(({ message }) => {
            toast.error(message);
            return setIsLoading(false);
          });
      } else dispatch({ type: 'NOT_LOGGED_IN', payload: NaN });
    });
  };

  return (
    <Form layout="vertical" style={{ width: '30em' }} requiredMark={false} onFinish={handleSubmit}>
      <Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'This field is required' },
          { min: 8, message: 'Password must be minimum 8 characters' },
        ]}
      >
        <Password type="password" visibilityToggle />
      </Item>
      <Item
        className="mt-2"
        name="confirmpassword"
        label="Confirm password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'This field is required' },
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
        <Password type="password" visibilityToggle />
      </Item>
      <Button className="mt-2" type="primary" htmlType="submit" disabled={isLoading}>
        Reset Password
      </Button>
    </Form>
  );
};

export default ResetPassword;
