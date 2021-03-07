import React, { useState, useEffect } from 'react';
import { Menu, Spin } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  UserAddOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './_header.less';

import Cart from './Cart';
import Search from './SearchBar';
import Logout from '../pages/auth/Logout';

const { Item, SubMenu } = Menu;

const Header = () => {
  const { pathname } = useLocation();

  const { user } = useSelector((state) => state);

  const [isLoading, setIsLoading] = useState(null);

  if (isLoading !== true && user === null) setIsLoading(true);
  else if (isLoading === true && user !== null) setIsLoading(false);

  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (pathname === '/') {
      setOpenKeys('home');
    } else {
      const path_names = pathname.split('/');
      setOpenKeys(path_names[path_names.length - 1]);
    }
  }, [pathname]);

  const onOpenChange = (openKeys) => setOpenKeys((openedKeys) => [...openedKeys, ...openKeys]);

  return (
    <Menu
      className="align-middle"
      mode="horizontal"
      selectedKeys={openKeys}
      onOpenChange={onOpenChange}
    >
      <Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      {(() => {
        if (isLoading)
          return (
            <Item className="float-right" disabled>
              <Spin />
            </Item>
          );
        else if (user)
          return (
            <>
              <SubMenu
                key="usersubmenu"
                icon={<UserOutlined />}
                title={user.name}
                className="float-right"
              >
                {user.role === 'admin' && (
                  <Item
                    key="adminDashboard"
                    icon={<SettingOutlined />}
                    className="admin-dashboard-item"
                  >
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                  </Item>
                )}
                <Item key="dashboard" icon={<SettingOutlined />}>
                  <Link to="/user/dashboard">Dashboard</Link>
                </Item>
                <Logout />
              </SubMenu>
              <SubMenu
                key="cartdropdown"
                icon={<ShoppingCartOutlined />}
                title={'Cart'}
                className="float-right"
              >
                <Cart />
              </SubMenu>
            </>
          );
        else
          return (
            <>
              <Item key="login" icon={<UserOutlined />} className="float-right">
                <Link to="/login">Login</Link>
              </Item>
              <Item key="register" icon={<UserAddOutlined />} className="float-right">
                <Link to="/register">Register</Link>
              </Item>
            </>
          );
      })()}
      <Search />
    </Menu>
  );
};

export default Header;
