import React from 'react';
import { Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebase';

const { Item } = Menu;

const Logout = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  function logOut() {
    return setTimeout(() => {
      auth
        .signOut()
        .then(() =>
          dispatch({
            type: 'LOGOUT',
            payload: null,
          })
        )
        .then(() => history.push('/'));
    }, 500);
  }

  return (
    <>
      <Item key="logout" icon={<LogoutOutlined />} {...props}>
        <button
          onClick={logOut}
          style={{
            backgroundColor: 'initial',
            outline: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </Item>
    </>
  );
};

export default Logout;
