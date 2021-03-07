import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import axios from 'axios';

export const resetEmail = async (email, newemail, authtoken) => {
  return await axios.post(
    process.env.REACT_APP_API + 'reset-email',
    {},
    {
      headers: {
        email,
        newemail,
        authtoken,
      },
    }
  );
};

const { Item } = Form;

const ResetEmail = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(null);

  const handleSubmit = ({ email, newemail }) => {
    setIsLoading(true);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = (await user.getIdTokenResult()).token;

        user
          .updateEmail(newemail)
          .then(() => {
            resetEmail(email, newemail, token).then((res) => {
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
            toast.success('You successfully updated your email address');
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
        name="email"
        label="Current Email"
        rules={[{ required: true, message: 'This field is required' }]}
      >
        <Input type="email" placeholder="current@email.com" />
      </Item>
      <Item
        className="mt-2"
        name="newemail"
        label="New Email"
        dependencies={['email']}
        rules={[
          { required: true, message: 'This field is required' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (
                getFieldValue('email') &&
                getFieldValue('email').length !== 0 &&
                getFieldValue('email') === value
              ) {
                return Promise.reject('You cannot update your email to the current one');
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input type="email" placeholder="new@email.com" />
      </Item>
      <Button className="mt-2" type="primary" htmlType="submit" disabled={isLoading}>
        Reset Email
      </Button>
    </Form>
  );
};

export default ResetEmail;
